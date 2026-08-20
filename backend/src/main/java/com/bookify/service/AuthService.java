package com.bookify.service;

import com.bookify.dto.request.auth.*;
import com.bookify.dto.response.auth.AuthResponse;
import com.bookify.dto.response.auth.TokenRefreshResponse;
import com.bookify.entity.*;
import com.bookify.exception.*;
import com.bookify.mapper.UserMapper;
import com.bookify.repository.PasswordResetTokenRepository;
import com.bookify.repository.UserRepository;
import com.bookify.security.JwtTokenProvider;
import com.bookify.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final TokenService tokenService;
    private final EmailService emailService;
    private final UserMapper userMapper;

    private final ConcurrentHashMap<String, Integer> otpAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> otpRequestCooldown = new ConcurrentHashMap<>();

    private static final java.util.Set<String> DISPOSABLE_EMAIL_DOMAINS = java.util.Set.of(
            "tempmail.com", "temp-mail.org", "mailinator.com", "guerrillamail.com",
            "10minutemail.com", "trashmail.com", "yopmail.com", "sharklasers.com",
            "getairmail.com", "fake.com", "test.com", "dummy.com", "example.com",
            "dispostable.com", "fakemail.net", "throwawaymail.com", "burnermail.io",
            "mohmal.com", "mytemp.email", "tempail.com", "nada.ltd"
    );

    @Transactional
    public void register(RegisterRequest request) {
        String cleanEmail = com.bookify.util.InputSanitizer.sanitizeEmail(request.getEmail());
        String cleanName = com.bookify.util.InputSanitizer.sanitizePlainText(request.getName());
        if (cleanEmail != null && cleanEmail.contains("@")) {
            String domain = cleanEmail.substring(cleanEmail.indexOf('@') + 1);
            if (DISPOSABLE_EMAIL_DOMAINS.contains(domain) || !domain.contains(".")) {
                throw new BadRequestException(
                        "Disposable or temporary email domains are not permitted. Please sign up with a real email account (e.g. Gmail, Outlook, Yahoo, iCloud).",
                        ErrorCode.BAD_REQUEST
                );
            }
        }
        if (userRepository.existsByEmail(cleanEmail))
            throw new DuplicateResourceException("An account with this email already exists", ErrorCode.DUPLICATE_EMAIL);
        User user = User.builder()
                .name(cleanName)
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .status(UserStatus.ACTIVE)
                .emailVerified(true)
                .readingGoal(12)
                .build();
        userRepository.save(user);
        try {
            String token = tokenService.createEmailVerificationToken(user);
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        } catch (Exception e) {
            log.warn("Could not dispatch welcome email to {}: {}", cleanEmail, e.getMessage());
        }
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = com.bookify.util.InputSanitizer.sanitizeEmail(request.getEmail());
        String raw = request.getPassword();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password", ErrorCode.INVALID_CREDENTIALS));
        if (!passwordEncoder.matches(raw, user.getPassword()))
            throw new UnauthorizedException("Invalid email or password", ErrorCode.INVALID_CREDENTIALS);
        if (!Boolean.TRUE.equals(user.getEmailVerified()))
            throw new EmailNotVerifiedException("Please verify your email before logging in.");
        if (user.getStatus() == UserStatus.BANNED)
            throw new ForbiddenException("Your account has been suspended.");
        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        RefreshToken refreshToken = tokenService.createRefreshToken(user);
        return AuthResponse.builder()
                .accessToken(accessToken).refreshToken(refreshToken.getToken())
                .expiresIn(tokenProvider.getJwtExpirationInMs() / 1000)
                .user(userMapper.toSummaryResponse(user)).build();
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleAuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (!email.contains("@") || email.length() < 5) throw new BadRequestException("Invalid Google email");
        
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = userRepository.save(User.builder()
                .name(request.getName() != null ? request.getName().trim() : "Google Reader")
                .email(email).password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .profileImage(request.getProfileImage())
                .role(Role.ROLE_USER).status(UserStatus.ACTIVE).emailVerified(true).readingGoal(12).build());
            try {
                emailService.sendWelcomeEmail(newUser.getEmail(), newUser.getName());
            } catch (Exception ignored) {}
            return newUser;
        });

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        RefreshToken refreshToken = tokenService.createRefreshToken(user);
        return AuthResponse.builder()
                .accessToken(accessToken).refreshToken(refreshToken.getToken())
                .expiresIn(tokenProvider.getJwtExpirationInMs() / 1000)
                .user(userMapper.toSummaryResponse(user)).build();
    }

    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        RefreshToken verified = tokenService.verifyRefreshToken(request.getRefreshToken());
        RefreshToken rotated = tokenService.rotateRefreshToken(verified);
        UserPrincipal principal = UserPrincipal.create(rotated.getUser());
        return TokenRefreshResponse.builder()
                .accessToken(tokenProvider.generateAccessToken(principal))
                .refreshToken(rotated.getToken())
                .expiresIn(tokenProvider.getJwtExpirationInMs() / 1000).build();
    }

    @Transactional
    public void logout(String refreshToken) { tokenService.revokeRefreshToken(refreshToken); }

    @Transactional
    public String sendPasswordResetOtp(String email) {
        String cleanEmail = email.toLowerCase().trim();
        LocalDateTime last = otpRequestCooldown.get(cleanEmail);
        if (last != null && last.plusSeconds(10).isAfter(LocalDateTime.now()))
            throw new BadRequestException("Please wait a few seconds before requesting another OTP.");
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email", ErrorCode.USER_NOT_FOUND));
        String otp = String.format("%06d", new SecureRandom().nextInt(1000000));
        passwordResetTokenRepository.invalidateUserTokens(user);
        passwordResetTokenRepository.save(PasswordResetToken.builder()
                .user(user).token(otp).expiresAt(Instant.now().plusSeconds(600)).used(false).build());
        otpAttempts.put(cleanEmail, 0);
        otpRequestCooldown.put(cleanEmail, LocalDateTime.now());
        
        log.info("==========================================================================");
        log.info("🔑 [PASSWORD RESET OTP] For email: {}", cleanEmail);
        log.info("👉 6-Digit OTP Code: {} (Valid for 10 minutes)", otp);
        log.info("==========================================================================");

        try {
            emailService.sendPasswordResetOtpEmail(user.getEmail(), user.getName(), otp);
        } catch (Exception e) {
            log.warn("SMTP email dispatch failed: {}", e.getMessage());
        }

        return otp;
    }

    @Transactional
    public void resetPasswordWithOtp(ResetPasswordOtpRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        int attempts = otpAttempts.getOrDefault(cleanEmail, 0);
        if (attempts >= 5) throw new ForbiddenException("Too many invalid attempts. Please request a new OTP.");
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getOtp().trim()).orElse(null);
        if (resetToken == null || !resetToken.getUser().getId().equals(user.getId())) {
            otpAttempts.put(cleanEmail, attempts + 1);
            throw new BadRequestException("Invalid OTP code. " + (4 - attempts) + " attempts remaining.");
        }
        if (Boolean.TRUE.equals(resetToken.getUsed()) || resetToken.getExpiresAt().isBefore(Instant.now()))
            throw new BadRequestException("This OTP code has expired. Please request a new one.");
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        resetToken.setUsed(true); passwordResetTokenRepository.save(resetToken);
        otpAttempts.remove(cleanEmail);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
            throw new BadRequestException("Current password does not match");
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void verifyEmail(String token) {
        User user = tokenService.verifyEmailToken(token);
        user.setEmailVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        log.info("Email verified for user: {}", user.getEmail());
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        String cleanEmail = email.toLowerCase().trim();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email", ErrorCode.USER_NOT_FOUND));
        if (Boolean.TRUE.equals(user.getEmailVerified()))
            throw new BadRequestException("This email is already verified");
        String token = tokenService.createEmailVerificationToken(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
    }

}
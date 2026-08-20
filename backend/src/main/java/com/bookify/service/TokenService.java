package com.bookify.service;

import com.bookify.entity.EmailVerificationToken;
import com.bookify.entity.PasswordResetToken;
import com.bookify.entity.RefreshToken;
import com.bookify.entity.User;
import com.bookify.exception.BadRequestException;
import com.bookify.exception.ErrorCode;
import com.bookify.repository.EmailVerificationTokenRepository;
import com.bookify.repository.PasswordResetTokenRepository;
import com.bookify.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Value("${bookify.jwt.refresh-token-expiration-days:7}")
    private long refreshTokenExpirationDays;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        return refreshTokenRepository.save(RefreshToken.builder()
                .user(user).token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plus(refreshTokenExpirationDays, ChronoUnit.DAYS))
                .revoked(false).build());
    }

    @Transactional
    public RefreshToken verifyRefreshToken(String tokenStr) {
        RefreshToken token = refreshTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token", ErrorCode.TOKEN_INVALID));
        if (token.getRevoked()) throw new BadRequestException("Refresh token was revoked", ErrorCode.TOKEN_INVALID);
        if (token.getExpiresAt().isBefore(Instant.now())) {
            token.setRevoked(true); refreshTokenRepository.save(token);
            throw new BadRequestException("Refresh token expired", ErrorCode.TOKEN_EXPIRED);
        }
        return token;
    }

    @Transactional
    public RefreshToken rotateRefreshToken(RefreshToken token) {
        token.setRevoked(true);
        refreshTokenRepository.save(token);
        return createRefreshToken(token.getUser());
    }

    @Transactional
    public RefreshToken verifyAndRotateRefreshToken(String tokenStr) {
        return rotateRefreshToken(verifyRefreshToken(tokenStr));
    }

    @Transactional
    public void revokeRefreshToken(String tokenStr) {
        refreshTokenRepository.findByToken(tokenStr).ifPresent(t -> {
            t.setRevoked(true); refreshTokenRepository.save(t);
        });
    }

    @Transactional
    public String createEmailVerificationToken(User user) {
        emailVerificationTokenRepository.invalidateUserTokens(user);
        EmailVerificationToken token = EmailVerificationToken.builder()
                .user(user).token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS)).used(false).build();
        emailVerificationTokenRepository.save(token);
        return token.getToken();
    }

    @Transactional
    public User verifyEmailToken(String tokenStr) {
        EmailVerificationToken token = emailVerificationTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new BadRequestException("Invalid email verification token", ErrorCode.TOKEN_INVALID));
        if (token.getUsed()) throw new BadRequestException("Token has already been used", ErrorCode.TOKEN_INVALID);
        if (token.getExpiresAt().isBefore(Instant.now())) throw new BadRequestException("Verification token has expired", ErrorCode.TOKEN_EXPIRED);
        token.setUsed(true); emailVerificationTokenRepository.save(token);
        return token.getUser();
    }
}

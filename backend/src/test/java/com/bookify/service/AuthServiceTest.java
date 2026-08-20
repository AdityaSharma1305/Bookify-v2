package com.bookify.service;

import com.bookify.dto.request.auth.LoginRequest;
import com.bookify.dto.request.auth.RegisterRequest;
import com.bookify.dto.response.auth.AuthResponse;
import com.bookify.dto.response.auth.UserSummaryResponse;
import com.bookify.entity.RefreshToken;
import com.bookify.entity.Role;
import com.bookify.entity.User;
import com.bookify.entity.UserStatus;
import com.bookify.exception.DuplicateResourceException;
import com.bookify.exception.EmailNotVerifiedException;
import com.bookify.exception.UnauthorizedException;
import com.bookify.mapper.UserMapper;
import com.bookify.repository.UserRepository;
import com.bookify.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private TokenService tokenService;

    @Mock
    private EmailService emailService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("encoded_pass")
                .role(Role.ROLE_USER)
                .status(UserStatus.ACTIVE)
                .emailVerified(true)
                .build();
    }

    @Test
    void register_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .name("New User")
                .email("new@example.com")
                .password("Password123!")
                .build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashed");
        when(tokenService.createEmailVerificationToken(any(User.class))).thenReturn("token-123");

        assertDoesNotThrow(() -> authService.register(request));
        verify(userRepository).save(any(User.class));
        verify(emailService).sendVerificationEmail(eq("new@example.com"), eq("New User"), eq("token-123"));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Test")
                .email("test@example.com")
                .password("Password123!")
                .build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);
        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }

    @Test
    void login_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("test@example.com")
                .password("Password123!")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("Password123!", "encoded_pass")).thenReturn(true);
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("jwt.token.here");
        when(tokenProvider.getExpirationInMs()).thenReturn(900000L);

        RefreshToken refreshToken = RefreshToken.builder().token("refresh-123").user(sampleUser).build();
        when(tokenService.createRefreshToken(sampleUser)).thenReturn(refreshToken);
        when(userMapper.toSummaryResponse(sampleUser)).thenReturn(UserSummaryResponse.builder().id(1L).email("test@example.com").build());

        AuthResponse response = authService.login(request);
        assertNotNull(response);
        assertEquals("jwt.token.here", response.getAccessToken());
        assertEquals("refresh-123", response.getRefreshToken());
    }

    @Test
    void login_UnverifiedEmail_ThrowsException() {
        sampleUser.setEmailVerified(false);
        LoginRequest request = LoginRequest.builder().email("test@example.com").password("Password123!").build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("Password123!", "encoded_pass")).thenReturn(true);

        assertThrows(EmailNotVerifiedException.class, () -> authService.login(request));
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        LoginRequest request = LoginRequest.builder().email("test@example.com").password("wrong").build();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrong", "encoded_pass")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }
}

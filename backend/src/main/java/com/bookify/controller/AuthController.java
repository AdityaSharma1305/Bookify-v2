package com.bookify.controller;

import com.bookify.dto.request.auth.*;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.auth.AuthResponse;
import com.bookify.dto.response.auth.TokenRefreshResponse;
import com.bookify.security.UserPrincipal;
import com.bookify.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration, login, OTP reset, tokens")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user account (sends verification email)")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.message("Registration successful. Please check your email to activate your account."));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify account email address")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.message("Email verified successfully! You can now log in."));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend account verification email")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        authService.resendVerificationEmail(request.getEmail());
        return ResponseEntity.ok(ApiResponse.message("Verification email resent. Please check your inbox."));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT Access + Refresh token pair")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/google")
    @Operation(summary = "Sign in or sign up with Google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        AuthResponse response = authService.loginWithGoogle(request);
        return ResponseEntity.ok(ApiResponse.success("Google sign-in successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Exchange Refresh Token for a new Access Token with token rotation")
    public ResponseEntity<ApiResponse<TokenRefreshResponse>> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        TokenRefreshResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke active refresh token")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.message("Logged out successfully"));
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send 6-digit OTP code to email for password reset")
    public ResponseEntity<ApiResponse<String>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        String otp = authService.sendPasswordResetOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("6-digit OTP sent! Code: " + otp + " (Valid for 10 minutes)", otp));
    }

    @PostMapping("/verify-otp-reset")
    @Operation(summary = "Verify 6-digit OTP and reset password")
    public ResponseEntity<ApiResponse<Void>> resetPasswordWithOtp(@Valid @RequestBody ResetPasswordOtpRequest request) {
        authService.resetPasswordWithOtp(request);
        return ResponseEntity.ok(ApiResponse.message("Password has been reset successfully! You can now log in."));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password for authenticated user")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.message("Password updated successfully"));
    }
}

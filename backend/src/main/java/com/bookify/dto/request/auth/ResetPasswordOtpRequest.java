package com.bookify.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordOtpRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "OTP code is required")
    @Size(min = 6, max = 6, message = "OTP must be 6 digits")
    private String otp;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @jakarta.validation.constraints.Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&^#~_+\\-=\\[\\]{}()|;:,.<>/])[A-Za-z\\d@$!%*?&^#~_+\\-=\\[\\]{}()|;:,.<>/]{8,}$",
            message = "New password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
    )
    private String newPassword;
}

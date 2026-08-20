package com.bookify.dto.response.auth;

import com.bookify.entity.Role;
import com.bookify.entity.UserStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private UserStatus status;
    private Boolean emailVerified;
    private String profileImage;
    private Integer readingGoal;
}

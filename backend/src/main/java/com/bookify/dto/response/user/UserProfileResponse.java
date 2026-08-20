package com.bookify.dto.response.user;

import com.bookify.entity.Role;
import com.bookify.entity.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private UserStatus status;
    private Boolean emailVerified;
    private String bio;
    private String profileImage;
    private Integer readingGoal;
    private Long booksReadCount;
    private Long currentlyReadingCount;
    private Long wantToReadCount;
    private Long favoritesCount;
    private Long reviewsCount;
    private LocalDateTime createdAt;
}

package com.bookify.dto.response.review;

import com.bookify.dto.response.auth.UserSummaryResponse;
import com.bookify.entity.ReviewStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private UserSummaryResponse user;
    private Integer rating;
    private String title;
    private String body;
    private Integer helpfulCount;
    private ReviewStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

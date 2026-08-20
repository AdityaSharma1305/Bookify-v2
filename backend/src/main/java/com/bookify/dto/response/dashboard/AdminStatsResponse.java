package com.bookify.dto.response.dashboard;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private Long totalBooks;
    private Long totalUsers;
    private Long totalAuthors;
    private Long totalReviews;
    private Long activeUsers;
    private Long booksAddedThisMonth;
    private Long newUsersThisMonth;
}

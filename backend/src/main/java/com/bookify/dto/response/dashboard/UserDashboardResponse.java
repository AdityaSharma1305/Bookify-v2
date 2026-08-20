package com.bookify.dto.response.dashboard;

import com.bookify.dto.response.reading.ReadingProgressResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDashboardResponse {
    private Long booksRead;
    private Long currentlyReading;
    private Long wantToRead;
    private Long favoritesCount;
    private Integer readingGoal;
    private Double averageRatingGiven;
    private List<ReadingProgressResponse> currentBooks;
    private List<ReadingProgressResponse> recentActivity;
    private List<ChartDataPoint> booksReadPerMonth;
    private List<ChartDataPoint> genreDistribution;
}

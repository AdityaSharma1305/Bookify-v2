package com.bookify.dto.response.dashboard;

import com.bookify.dto.response.book.BookSummaryResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAnalyticsResponse {
    private List<BookSummaryResponse> popularBooks;
    private List<BookSummaryResponse> highestRatedBooks;
    private List<ChartDataPoint> popularGenres;
    private List<ChartDataPoint> monthlyRegistrations;
    private List<ChartDataPoint> monthlyBookAdditions;
}

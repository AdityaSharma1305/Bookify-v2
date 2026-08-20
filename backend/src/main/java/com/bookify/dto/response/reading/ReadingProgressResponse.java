package com.bookify.dto.response.reading;

import com.bookify.dto.response.book.BookSummaryResponse;
import com.bookify.entity.ReadingStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingProgressResponse {
    private Long id;
    private BookSummaryResponse book;
    private ReadingStatus status;
    private Integer currentPage;
    private Integer totalPages;
    private Integer percentage;
    private LocalDate startedAt;
    private LocalDate completedAt;
    private LocalDateTime updatedAt;
}

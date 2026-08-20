package com.bookify.dto.response.favorite;

import com.bookify.dto.response.book.BookSummaryResponse;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteResponse {
    private Long id;
    private BookSummaryResponse book;
    private LocalDateTime createdAt;
}

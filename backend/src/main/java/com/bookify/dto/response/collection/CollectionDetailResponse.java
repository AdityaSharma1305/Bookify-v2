package com.bookify.dto.response.collection;

import com.bookify.dto.response.book.BookSummaryResponse;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionDetailResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean isPublic;
    private List<BookSummaryResponse> books;
    private Integer bookCount;
    private LocalDateTime createdAt;
}

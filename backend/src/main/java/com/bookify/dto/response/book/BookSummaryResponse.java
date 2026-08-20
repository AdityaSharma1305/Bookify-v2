package com.bookify.dto.response.book;

import com.bookify.dto.response.author.AuthorSummaryResponse;
import com.bookify.dto.response.category.CategoryResponse;
import com.bookify.entity.BookStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookSummaryResponse {
    private Long id;
    private String isbn;
    private String title;
    private String subtitle;
    private AuthorSummaryResponse author;
    private String coverImage;
    private BigDecimal averageRating;
    private Integer totalRatings;
    private Integer totalReviews;
    private BigDecimal price;
    private BookStatus status;
    private List<CategoryResponse> categories;
}

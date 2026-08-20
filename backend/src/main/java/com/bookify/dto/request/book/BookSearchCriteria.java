package com.bookify.dto.request.book;

import com.bookify.entity.BookStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookSearchCriteria {
    private String query;
    private String genre;
    private String authorName;
    private BigDecimal minRating;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String language;
    private Integer fromYear;
    private Integer toYear;
    private BookStatus status;
}

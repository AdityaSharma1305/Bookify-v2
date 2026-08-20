package com.bookify.dto.response.book;

import com.bookify.dto.response.author.AuthorSummaryResponse;
import com.bookify.dto.response.category.CategoryResponse;
import com.bookify.dto.response.review.RatingDistributionResponse;
import com.bookify.dto.response.review.ReviewResponse;
import com.bookify.entity.BookStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDetailResponse {
    private Long id;
    private String isbn;
    private String title;
    private String subtitle;
    private String description;
    private AuthorSummaryResponse author;
    private String publisher;
    private LocalDate publicationDate;
    private String language;
    private Integer pageCount;
    private BigDecimal price;
    private String coverImage;
    private BigDecimal averageRating;
    private Integer totalRatings;
    private Integer totalReviews;
    private BookStatus status;
    private List<CategoryResponse> categories;
    private List<ReviewResponse> recentReviews;
    private RatingDistributionResponse ratingDistribution;
    private List<BookSummaryResponse> relatedBooks;
    private List<BookSummaryResponse> otherBooksByAuthor;
    private Boolean isFavorite;
    private String readingStatus;
    private Integer currentPage;
    private LocalDateTime createdAt;
}

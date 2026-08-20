package com.bookify.dto.response.marketplace;

import com.bookify.dto.response.auth.UserSummaryResponse;
import com.bookify.dto.response.book.BookSummaryResponse;
import com.bookify.entity.BookCondition;
import com.bookify.entity.ListingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingResponse {
    private Long id;
    private UserSummaryResponse seller;
    private BookSummaryResponse book;
    private BookCondition conditionGrade;
    private String conditionDescription;
    private String photoUrl;
    private BigDecimal listingPrice;
    private BigDecimal originalPrice;
    private Integer discountPercentage;
    private BigDecimal shippingFee;
    private ListingStatus status;
    private LocalDateTime createdAt;
}

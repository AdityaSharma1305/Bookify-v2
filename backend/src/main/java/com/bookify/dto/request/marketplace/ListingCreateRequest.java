package com.bookify.dto.request.marketplace;

import com.bookify.entity.BookCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingCreateRequest {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotNull(message = "Condition grade is required")
    private BookCondition conditionGrade;

    private String conditionDescription;
    private String photoUrl;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.50", message = "Listing price must be at least $0.50")
    private BigDecimal listingPrice;

    private BigDecimal shippingFee;
}

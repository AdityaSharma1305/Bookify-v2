package com.bookify.dto.response.marketplace;

import com.bookify.dto.response.auth.UserSummaryResponse;
import com.bookify.entity.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private UserSummaryResponse buyer;
    private UserSummaryResponse seller;
    private ListingResponse listing;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private OrderStatus orderStatus;
    private String trackingNumber;
    private LocalDateTime createdAt;
}

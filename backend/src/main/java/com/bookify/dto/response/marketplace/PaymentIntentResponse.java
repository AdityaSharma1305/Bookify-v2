package com.bookify.dto.response.marketplace;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentIntentResponse {
    private String clientSecret;
    private String paymentIntentId;
    private String publishableKey;
    private Long orderId;
    private String orderNumber;
    private BigDecimal amount;
    private String currency;
}

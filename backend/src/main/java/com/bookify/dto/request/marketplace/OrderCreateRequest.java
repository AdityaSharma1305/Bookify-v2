package com.bookify.dto.request.marketplace;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {

    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
}

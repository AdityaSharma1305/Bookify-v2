package com.bookify.controller;

import com.bookify.dto.request.marketplace.OrderCreateRequest;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.marketplace.OrderResponse;
import com.bookify.dto.response.marketplace.PaymentIntentResponse;
import com.bookify.security.UserPrincipal;
import com.bookify.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders & Purchases", description = "Marketplace purchase order management")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    @Operation(summary = "Create order and initialize Stripe payment intent")
    public ResponseEntity<ApiResponse<PaymentIntentResponse>> checkout(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody OrderCreateRequest request) {
        PaymentIntentResponse response = orderService.createOrderAndCheckout(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Payment intent created", response));
    }

    @PostMapping("/{orderId}/confirm-paid")
    @Operation(summary = "Confirm order payment after client-side Stripe payment completion")
    public ResponseEntity<ApiResponse<OrderResponse>> confirmPaid(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long orderId) {
        OrderResponse response = orderService.confirmOrderPaid(currentUser.getId(), orderId);
        return ResponseEntity.ok(ApiResponse.success("Order payment confirmed! Seller has been notified to ship.", response));
    }

    @GetMapping("/purchases")
    @Operation(summary = "Get user's purchased book orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getPurchases(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(orderService.getBuyerOrders(currentUser.getId(), pageable))));
    }

    @GetMapping("/sales")
    @Operation(summary = "Get user's sales as a seller")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getSales(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(orderService.getSellerSales(currentUser.getId(), pageable))));
    }

    @PatchMapping("/{orderId}/ship")
    @Operation(summary = "Seller marks order as shipped with tracking number")
    public ResponseEntity<ApiResponse<OrderResponse>> markShipped(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long orderId,
            @RequestParam String trackingNumber) {
        OrderResponse response = orderService.markShipped(currentUser.getId(), orderId, trackingNumber);
        return ResponseEntity.ok(ApiResponse.success("Order marked as shipped", response));
    }

    @PatchMapping("/{orderId}/delivered")
    @Operation(summary = "Buyer confirms package delivered and releases funds")
    public ResponseEntity<ApiResponse<OrderResponse>> markDelivered(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long orderId) {
        OrderResponse response = orderService.markDelivered(currentUser.getId(), orderId);
        return ResponseEntity.ok(ApiResponse.success("Delivery confirmed and payout released to seller", response));
    }
}

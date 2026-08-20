package com.bookify.service;

import com.bookify.dto.request.marketplace.OrderCreateRequest;
import com.bookify.dto.response.marketplace.OrderResponse;
import com.bookify.dto.response.marketplace.PaymentIntentResponse;
import com.bookify.entity.*;
import com.bookify.exception.*;
import com.bookify.mapper.OrderMapper;
import com.bookify.repository.BookListingRepository;
import com.bookify.repository.OrderRepository;
import com.bookify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookListingRepository bookListingRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    private final OrderMapper orderMapper;

    @Transactional
    public PaymentIntentResponse createOrderAndCheckout(Long buyerId, OrderCreateRequest request) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found", ErrorCode.USER_NOT_FOUND));

        BookListing listing = bookListingRepository.findById(request.getListingId())
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found", ErrorCode.RESOURCE_NOT_FOUND));

        if (listing.getStatus() != ListingStatus.AVAILABLE) {
            throw new BadRequestException("This book is no longer available for purchase");
        }

        if (listing.getSeller().getId().equals(buyerId)) {
            throw new BadRequestException("You cannot purchase your own listing");
        }

        // Reserve listing
        listing.setStatus(ListingStatus.RESERVED);
        bookListingRepository.save(listing);

        BigDecimal shipping = listing.getShippingFee() != null ? listing.getShippingFee() : BigDecimal.ZERO;
        BigDecimal total = listing.getListingPrice().add(shipping);

        Order order = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .buyer(buyer)
                .seller(listing.getSeller())
                .listing(listing)
                .totalAmount(total)
                .shippingAddress(request.getShippingAddress().trim())
                .orderStatus(OrderStatus.PENDING_PAYMENT)
                .build();

        orderRepository.save(order);

        return paymentService.createPaymentIntent(order);
    }

    @Transactional
    public OrderResponse confirmOrderPaid(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found", ErrorCode.RESOURCE_NOT_FOUND));

        if (!order.getBuyer().getId().equals(userId)) {
            throw new ForbiddenException("Unauthorized order access");
        }

        order.setOrderStatus(OrderStatus.PAID);
        order.getListing().setStatus(ListingStatus.SOLD);
        orderRepository.save(order);

        // Notify seller
        notificationService.createNotification(
                order.getSeller(),
                "Book Sold! 🎉",
                "Your book '" + order.getListing().getBook().getTitle() + "' was purchased! Please pack and ship to buyer.",
                NotificationType.WISHLIST,
                "/orders"
        );

        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getBuyerOrders(Long buyerId, Pageable pageable) {
        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId, pageable).map(orderMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getSellerSales(Long sellerId, Pageable pageable) {
        return orderRepository.findBySellerIdOrderByCreatedAtDesc(sellerId, pageable).map(orderMapper::toResponse);
    }

    @Transactional
    public OrderResponse markShipped(Long sellerId, Long orderId, String trackingNumber) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found", ErrorCode.RESOURCE_NOT_FOUND));

        if (!order.getSeller().getId().equals(sellerId)) {
            throw new ForbiddenException("Only the seller can update shipping status");
        }

        order.setOrderStatus(OrderStatus.SHIPPED);
        order.setTrackingNumber(trackingNumber);
        orderRepository.save(order);

        // Notify buyer
        notificationService.createNotification(
                order.getBuyer(),
                "Order Shipped! 📦",
                "Your book '" + order.getListing().getBook().getTitle() + "' is on the way! Tracking: " + trackingNumber,
                NotificationType.SYSTEM,
                "/orders"
        );

        return orderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponse markDelivered(Long buyerId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found", ErrorCode.RESOURCE_NOT_FOUND));

        if (!order.getBuyer().getId().equals(buyerId)) {
            throw new ForbiddenException("Only the buyer can confirm delivery");
        }

        order.setOrderStatus(OrderStatus.DELIVERED);
        orderRepository.save(order);

        // Notify seller payout
        notificationService.createNotification(
                order.getSeller(),
                "Funds Released! 💰",
                "Buyer confirmed delivery for '" + order.getListing().getBook().getTitle() + "'. Payout has been released.",
                NotificationType.SYSTEM,
                "/orders"
        );

        return orderMapper.toResponse(order);
    }
}

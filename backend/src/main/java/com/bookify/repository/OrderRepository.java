package com.bookify.repository;

import com.bookify.entity.Order;
import com.bookify.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId, Pageable pageable);
    Page<Order> findBySellerIdOrderByCreatedAtDesc(Long sellerId, Pageable pageable);
    long countByBuyerIdAndOrderStatus(Long buyerId, OrderStatus status);
}

package com.bookify.entity;

import com.bookify.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "book_listings", indexes = {
        @Index(name = "idx_listing_book", columnList = "book_id"),
        @Index(name = "idx_listing_seller", columnList = "seller_id"),
        @Index(name = "idx_listing_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookListing extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_grade", nullable = false, length = 30)
    private BookCondition conditionGrade;

    @Column(name = "condition_description", columnDefinition = "TEXT")
    private String conditionDescription;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "listing_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal listingPrice;

    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ListingStatus status = ListingStatus.AVAILABLE;
}

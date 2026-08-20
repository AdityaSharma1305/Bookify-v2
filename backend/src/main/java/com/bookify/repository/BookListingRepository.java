package com.bookify.repository;

import com.bookify.entity.BookCondition;
import com.bookify.entity.BookListing;
import com.bookify.entity.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookListingRepository extends JpaRepository<BookListing, Long> {
    Page<BookListing> findByStatus(ListingStatus status, Pageable pageable);
    List<BookListing> findByBookIdAndStatus(Long bookId, ListingStatus status);
    Page<BookListing> findBySellerIdOrderByCreatedAtDesc(Long sellerId, Pageable pageable);

    @Query("SELECT l FROM BookListing l WHERE l.status = 'AVAILABLE' " +
            "AND (:query IS NULL OR LOWER(l.book.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l.book.isbn) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:condition IS NULL OR l.conditionGrade = :condition)")
    Page<BookListing> searchMarketplace(@Param("query") String query, @Param("condition") BookCondition condition, Pageable pageable);
}

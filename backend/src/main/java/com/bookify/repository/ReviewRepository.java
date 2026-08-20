package com.bookify.repository;

import com.bookify.entity.Review;
import com.bookify.entity.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByUserIdAndBookId(Long userId, Long bookId);
    boolean existsByUserIdAndBookId(Long userId, Long bookId);
    Page<Review> findByBookIdAndStatus(Long bookId, ReviewStatus status, Pageable pageable);
    Page<Review> findByUserId(Long userId, Pageable pageable);
    Page<Review> findByStatus(ReviewStatus status, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.book.id = :bookId AND r.status = 'APPROVED'")
    Double calculateAverageRating(@Param("bookId") Long bookId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.book.id = :bookId AND r.status = 'APPROVED'")
    Integer countApprovedReviews(@Param("bookId") Long bookId);

    @Query("SELECT r.rating as rating, COUNT(r) as count FROM Review r WHERE r.book.id = :bookId AND r.status = 'APPROVED' GROUP BY r.rating")
    List<Object[]> getRatingDistribution(@Param("bookId") Long bookId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.user.id = :userId")
    Double calculateUserAverageRatingGiven(@Param("userId") Long userId);
}

package com.bookify.service;

import com.bookify.dto.request.review.ReviewCreateRequest;
import com.bookify.dto.request.review.ReviewUpdateRequest;
import com.bookify.dto.response.review.ReviewResponse;
import com.bookify.entity.*;
import com.bookify.exception.*;
import com.bookify.mapper.ReviewMapper;
import com.bookify.repository.BookRepository;
import com.bookify.repository.ReviewRepository;
import com.bookify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookService bookService;
    private final NotificationService notificationService;
    private final ReviewMapper reviewMapper;

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getBookReviews(Long bookId, Pageable pageable) {
        return reviewRepository.findByBookIdAndStatus(bookId, ReviewStatus.APPROVED, pageable)
                .map(reviewMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getUserReviews(Long userId, Pageable pageable) {
        return reviewRepository.findByUserId(userId, pageable).map(reviewMapper::toResponse);
    }

    @Transactional
    public ReviewResponse createReview(Long userId, Long bookId, ReviewCreateRequest request) {
        if (reviewRepository.existsByUserIdAndBookId(userId, bookId)) {
            throw new DuplicateResourceException("You have already reviewed this book", ErrorCode.DUPLICATE_REVIEW);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found", ErrorCode.BOOK_NOT_FOUND));

        Review review = reviewMapper.toEntity(request);
        review.setUser(user);
        review.setBook(book);
        review.setStatus(ReviewStatus.APPROVED);
        reviewRepository.save(review);

        bookService.recalculateRating(bookId);

        return reviewMapper.toResponse(review);
    }

    @Transactional
    public ReviewResponse updateReview(Long userId, Long reviewId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only edit your own reviews");
        }

        reviewMapper.updateEntityFromRequest(request, review);
        reviewRepository.save(review);

        bookService.recalculateRating(review.getBook().getId());

        return reviewMapper.toResponse(review);
    }

    @Transactional
    public void deleteReview(Long userId, Long reviewId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.REVIEW_NOT_FOUND));

        if (!isAdmin && !review.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only delete your own reviews");
        }

        Long bookId = review.getBook().getId();
        reviewRepository.delete(review);
        bookService.recalculateRating(bookId);
    }

    @Transactional
    public void markHelpful(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.REVIEW_NOT_FOUND));
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        reviewRepository.save(review);
    }

    @Transactional
    public ReviewResponse updateReviewStatus(Long reviewId, ReviewStatus status) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found", ErrorCode.REVIEW_NOT_FOUND));
        review.setStatus(status);
        reviewRepository.save(review);

        bookService.recalculateRating(review.getBook().getId());

        if (status == ReviewStatus.APPROVED) {
            notificationService.createNotification(
                    review.getUser(),
                    "Review Approved",
                    "Your review for '" + review.getBook().getTitle() + "' is now visible.",
                    NotificationType.REVIEW,
                    "/books/" + review.getBook().getId()
            );
        }

        return reviewMapper.toResponse(review);
    }
}

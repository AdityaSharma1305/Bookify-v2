package com.bookify.controller;

import com.bookify.dto.request.review.ReviewCreateRequest;
import com.bookify.dto.request.review.ReviewUpdateRequest;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.review.ReviewResponse;
import com.bookify.security.UserPrincipal;
import com.bookify.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Book rating and review management")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get reviews for a specific book")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getBookReviews(
            @PathVariable Long bookId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(reviewService.getBookReviews(bookId, pageable))));
    }

    @PostMapping("/book/{bookId}")
    @Operation(summary = "Submit a review for a book (1 review per user)")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long bookId,
            @Valid @RequestBody ReviewCreateRequest request) {
        ReviewResponse response = reviewService.createReview(currentUser.getId(), bookId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Review submitted successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update own review")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody ReviewUpdateRequest request) {
        ReviewResponse response = reviewService.updateReview(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Review updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete own review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        reviewService.deleteReview(currentUser.getId(), id, false);
        return ResponseEntity.ok(ApiResponse.message("Review deleted successfully"));
    }

    @PostMapping("/{id}/helpful")
    @Operation(summary = "Upvote a helpful review")
    public ResponseEntity<ApiResponse<Void>> markHelpful(@PathVariable Long id) {
        reviewService.markHelpful(id);
        return ResponseEntity.ok(ApiResponse.message("Thank you for your feedback!"));
    }
}

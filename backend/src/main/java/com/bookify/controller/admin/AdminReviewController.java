package com.bookify.controller.admin;

import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.review.ReviewResponse;
import com.bookify.entity.ReviewStatus;
import com.bookify.mapper.ReviewMapper;
import com.bookify.repository.ReviewRepository;
import com.bookify.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reviews")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin - Reviews", description = "Admin review moderation")
public class AdminReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @GetMapping
    @Operation(summary = "List reviews for moderation (filter by status)")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getReviews(
            @RequestParam(required = false) ReviewStatus status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        if (status != null) {
            return ResponseEntity.ok(ApiResponse.success(PageResponse.of(reviewRepository.findByStatus(status, pageable).map(reviewMapper::toResponse))));
        }
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(reviewRepository.findAll(pageable).map(reviewMapper::toResponse))));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update review status (PENDING, APPROVED, REJECTED)")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam ReviewStatus status) {
        ReviewResponse response = reviewService.updateReviewStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Review status updated", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete inappropriate review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(null, id, true);
        return ResponseEntity.ok(ApiResponse.message("Review deleted"));
    }
}

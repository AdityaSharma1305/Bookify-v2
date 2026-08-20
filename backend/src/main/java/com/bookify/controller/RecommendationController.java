package com.bookify.controller;

import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.book.BookSummaryResponse;
import com.bookify.security.UserPrincipal;
import com.bookify.service.BookService;
import com.bookify.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Tag(name = "Recommendations", description = "Personalized and trending book discovery algorithms")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get personalized book recommendations for authenticated user")
    public ResponseEntity<ApiResponse<List<BookSummaryResponse>>> getPersonalized(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(recommendationService.getPersonalizedRecommendations(currentUser.getId(), PageRequest.of(0, limit))));
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending books based on community favorites")
    public ResponseEntity<ApiResponse<List<BookSummaryResponse>>> getTrending(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(bookService.getTrendingBooks(PageRequest.of(0, limit))));
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Get top rated books")
    public ResponseEntity<ApiResponse<List<BookSummaryResponse>>> getTopRated(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(bookService.getTopRatedBooks(PageRequest.of(0, limit))));
    }

    @GetMapping("/new-releases")
    @Operation(summary = "Get new releases in the last 90 days")
    public ResponseEntity<ApiResponse<List<BookSummaryResponse>>> getNewReleases(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(bookService.getNewReleases(PageRequest.of(0, limit))));
    }

    @GetMapping("/because-you-read/{bookId}")
    @Operation(summary = "Get book recommendations similar to a specific book")
    public ResponseEntity<ApiResponse<List<BookSummaryResponse>>> getBecauseYouRead(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(ApiResponse.success(recommendationService.getBecauseYouRead(bookId, PageRequest.of(0, limit))));
    }
}

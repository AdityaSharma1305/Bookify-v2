package com.bookify.controller;

import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.favorite.FavoriteResponse;
import com.bookify.dto.response.favorite.FavoriteStatusResponse;
import com.bookify.security.UserPrincipal;
import com.bookify.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites", description = "User favorite books management")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    @Operation(summary = "Get current user's favorite books (paginated)")
    public ResponseEntity<ApiResponse<PageResponse<FavoriteResponse>>> getUserFavorites(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(favoriteService.getUserFavorites(currentUser.getId(), pageable))));
    }

    @PostMapping("/{bookId}")
    @Operation(summary = "Toggle favorite status for a book (add/remove)")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> toggleFavorite(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long bookId) {
        FavoriteStatusResponse response = favoriteService.toggleFavorite(currentUser.getId(), bookId);
        String msg = response.getIsFavorite() ? "Book added to favorites" : "Book removed from favorites";
        return ResponseEntity.ok(ApiResponse.success(msg, response));
    }

    @GetMapping("/{bookId}/status")
    @Operation(summary = "Check if a book is favorited by current user")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> checkFavoriteStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long bookId) {
        return ResponseEntity.ok(ApiResponse.success(favoriteService.checkFavoriteStatus(currentUser.getId(), bookId)));
    }
}

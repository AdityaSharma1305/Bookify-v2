package com.bookify.controller;

import com.bookify.dto.request.marketplace.ListingCreateRequest;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.marketplace.ListingResponse;
import com.bookify.entity.BookCondition;
import com.bookify.security.UserPrincipal;
import com.bookify.service.BookListingService;
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

import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
@Tag(name = "Marketplace Listings", description = "Used books buy & sell marketplace")
public class BookListingController {

    private final BookListingService listingService;

    @GetMapping
    @Operation(summary = "Browse marketplace listings with optional search and condition filters")
    public ResponseEntity<ApiResponse<PageResponse<ListingResponse>>> getMarketplace(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) BookCondition condition,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(listingService.getMarketplaceListings(q, condition, pageable))));
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get all available user listings for a specific book")
    public ResponseEntity<ApiResponse<List<ListingResponse>>> getListingsForBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(ApiResponse.success(listingService.getListingsForBook(bookId)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user's book listings")
    public ResponseEntity<ApiResponse<PageResponse<ListingResponse>>> getMyListings(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(listingService.getSellerListings(currentUser.getId(), pageable))));
    }

    @PostMapping
    @Operation(summary = "Sell a book: Create a new marketplace listing")
    public ResponseEntity<ApiResponse<ListingResponse>> createListing(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ListingCreateRequest request) {
        ListingResponse response = listingService.createListing(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Book listed for sale successfully!", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove a book listing from marketplace")
    public ResponseEntity<ApiResponse<Void>> deleteListing(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        listingService.deleteListing(currentUser.getId(), id, isAdmin);
        return ResponseEntity.ok(ApiResponse.message("Listing removed"));
    }
}

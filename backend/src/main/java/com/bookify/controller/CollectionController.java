package com.bookify.controller;

import com.bookify.dto.request.collection.CollectionCreateRequest;
import com.bookify.dto.request.collection.CollectionUpdateRequest;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.collection.CollectionDetailResponse;
import com.bookify.dto.response.collection.CollectionResponse;
import com.bookify.security.UserPrincipal;
import com.bookify.service.CollectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
@Tag(name = "Collections", description = "User custom book collections/lists")
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping
    @Operation(summary = "Get all collections of current user")
    public ResponseEntity<ApiResponse<List<CollectionResponse>>> getUserCollections(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success(collectionService.getUserCollections(currentUser.getId())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get collection details and books inside")
    public ResponseEntity<ApiResponse<CollectionDetailResponse>> getCollectionDetails(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(collectionService.getCollectionDetails(currentUser.getId(), id)));
    }

    @PostMapping
    @Operation(summary = "Create a new custom collection")
    public ResponseEntity<ApiResponse<CollectionResponse>> createCollection(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CollectionCreateRequest request) {
        CollectionResponse response = collectionService.createCollection(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Collection created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update collection name/description/visibility")
    public ResponseEntity<ApiResponse<CollectionResponse>> updateCollection(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody CollectionUpdateRequest request) {
        CollectionResponse response = collectionService.updateCollection(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Collection updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete collection")
    public ResponseEntity<ApiResponse<Void>> deleteCollection(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        collectionService.deleteCollection(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.message("Collection deleted successfully"));
    }

    @PostMapping("/{id}/books/{bookId}")
    @Operation(summary = "Add a book to collection")
    public ResponseEntity<ApiResponse<Void>> addBookToCollection(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @PathVariable Long bookId) {
        collectionService.addBookToCollection(currentUser.getId(), id, bookId);
        return ResponseEntity.ok(ApiResponse.message("Book added to collection"));
    }

    @DeleteMapping("/{id}/books/{bookId}")
    @Operation(summary = "Remove a book from collection")
    public ResponseEntity<ApiResponse<Void>> removeBookFromCollection(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @PathVariable Long bookId) {
        collectionService.removeBookFromCollection(currentUser.getId(), id, bookId);
        return ResponseEntity.ok(ApiResponse.message("Book removed from collection"));
    }
}

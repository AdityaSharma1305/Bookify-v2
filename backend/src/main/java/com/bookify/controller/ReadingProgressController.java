package com.bookify.controller;

import com.bookify.dto.request.reading.ReadingProgressUpdateRequest;
import com.bookify.dto.request.reading.ReadingStatusUpdateRequest;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.reading.ReadingProgressResponse;
import com.bookify.entity.ReadingStatus;
import com.bookify.security.UserPrincipal;
import com.bookify.service.ReadingProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reading-progress")
@RequiredArgsConstructor
@Tag(name = "Reading Progress", description = "Reading library and page tracking")
public class ReadingProgressController {

    private final ReadingProgressService readingProgressService;

    @GetMapping
    @Operation(summary = "Get user library books filtered by status (WANT_TO_READ, CURRENTLY_READING, COMPLETED, ABANDONED)")
    public ResponseEntity<ApiResponse<PageResponse<ReadingProgressResponse>>> getUserLibrary(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) ReadingStatus status,
            @PageableDefault(size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(readingProgressService.getUserLibrary(currentUser.getId(), status, pageable))));
    }

    @PostMapping("/book/{bookId}/status")
    @Operation(summary = "Set or change reading status for a book")
    public ResponseEntity<ApiResponse<ReadingProgressResponse>> updateStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long bookId,
            @Valid @RequestBody ReadingStatusUpdateRequest request) {
        ReadingProgressResponse response = readingProgressService.updateStatus(currentUser.getId(), bookId, request);
        return ResponseEntity.ok(ApiResponse.success("Reading status updated", response));
    }

    @PutMapping("/book/{bookId}/progress")
    @Operation(summary = "Update current page count for reading progress")
    public ResponseEntity<ApiResponse<ReadingProgressResponse>> updateProgress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long bookId,
            @Valid @RequestBody ReadingProgressUpdateRequest request) {
        ReadingProgressResponse response = readingProgressService.updateProgress(currentUser.getId(), bookId, request);
        return ResponseEntity.ok(ApiResponse.success("Reading progress updated", response));
    }

    @DeleteMapping("/book/{bookId}")
    @Operation(summary = "Remove book from reading library")
    public ResponseEntity<ApiResponse<Void>> deleteReadingProgress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long bookId) {
        readingProgressService.deleteReadingProgress(currentUser.getId(), bookId);
        return ResponseEntity.ok(ApiResponse.message("Book removed from reading list"));
    }
}

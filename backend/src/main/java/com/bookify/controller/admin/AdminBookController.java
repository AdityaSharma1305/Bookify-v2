package com.bookify.controller.admin;

import com.bookify.dto.request.book.BookCreateRequest;
import com.bookify.dto.request.book.BookUpdateRequest;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.book.BookResponse;
import com.bookify.entity.BookStatus;
import com.bookify.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/books")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin - Books", description = "Admin book catalog management")
public class AdminBookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "List all books including inactive/out-of-stock")
    public ResponseEntity<ApiResponse<PageResponse<BookResponse>>> getAllBooks(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(bookService.getAllBooks(pageable))));
    }

    @PostMapping
    @Operation(summary = "Create a new book in the catalog")
    public ResponseEntity<ApiResponse<BookResponse>> createBook(@Valid @RequestBody BookCreateRequest request) {
        BookResponse response = bookService.createBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Book created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing book")
    public ResponseEntity<ApiResponse<BookResponse>> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookUpdateRequest request) {
        BookResponse response = bookService.updateBook(id, request);
        return ResponseEntity.ok(ApiResponse.success("Book updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update book status (ACTIVE, INACTIVE, OUT_OF_STOCK)")
    public ResponseEntity<ApiResponse<BookResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam BookStatus status) {
        BookResponse response = bookService.updateBookStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Book status updated", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a book from the catalog")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.message("Book deleted successfully"));
    }
}

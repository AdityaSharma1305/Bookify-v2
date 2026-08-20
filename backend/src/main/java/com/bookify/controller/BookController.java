package com.bookify.controller;

import com.bookify.dto.request.book.BookSearchCriteria;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.book.BookDetailResponse;
import com.bookify.dto.response.book.BookResponse;
import com.bookify.entity.BookStatus;
import com.bookify.security.UserPrincipal;
import com.bookify.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Public Book discovery and search endpoints")
public class BookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "List and search books with multi-criteria filters")
    public ResponseEntity<ApiResponse<PageResponse<BookResponse>>> searchBooks(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Integer fromYear,
            @RequestParam(required = false) Integer toYear,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        BookSearchCriteria criteria = BookSearchCriteria.builder()
                .query(q)
                .genre(genre)
                .authorName(author)
                .minRating(minRating)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .language(language)
                .fromYear(fromYear)
                .toYear(toYear)
                .status(BookStatus.ACTIVE)
                .build();

        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(bookService.searchBooks(criteria, pageable))));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full book details including reviews, rating distribution, related books, and user status")
    public ResponseEntity<ApiResponse<BookDetailResponse>> getBookDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Long userId = currentUser != null ? currentUser.getId() : null;
        BookDetailResponse details = bookService.getBookDetails(id, userId);
        return ResponseEntity.ok(ApiResponse.success(details));
    }
}

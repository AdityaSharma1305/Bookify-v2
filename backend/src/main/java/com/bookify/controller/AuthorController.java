package com.bookify.controller;

import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.author.AuthorResponse;
import com.bookify.dto.response.author.AuthorSummaryResponse;
import com.bookify.dto.response.book.BookResponse;
import com.bookify.repository.BookRepository;
import com.bookify.mapper.BookMapper;
import com.bookify.service.AuthorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
@Tag(name = "Authors", description = "Public Author directory and details")
public class AuthorController {

    private final AuthorService authorService;
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    @GetMapping
    @Operation(summary = "List all authors")
    public ResponseEntity<ApiResponse<PageResponse<AuthorResponse>>> getAllAuthors(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(authorService.getAllAuthors(q, pageable))));
    }

    @GetMapping("/top")
    @Operation(summary = "Get top authors with most books")
    public ResponseEntity<ApiResponse<List<AuthorSummaryResponse>>> getTopAuthors() {
        return ResponseEntity.ok(ApiResponse.success(authorService.getTopAuthors(PageRequest.of(0, 10))));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get author details")
    public ResponseEntity<ApiResponse<AuthorResponse>> getAuthorById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(authorService.getAuthorById(id)));
    }

    @GetMapping("/{id}/books")
    @Operation(summary = "Get books by author")
    public ResponseEntity<ApiResponse<PageResponse<BookResponse>>> getAuthorBooks(
            @PathVariable Long id,
            @PageableDefault(size = 20, sort = "publicationDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(bookRepository.findByAuthorId(id, pageable).map(bookMapper::toResponse))));
    }
}

package com.bookify.controller.admin;

import com.bookify.dto.request.author.AuthorCreateRequest;
import com.bookify.dto.request.author.AuthorUpdateRequest;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.author.AuthorResponse;
import com.bookify.service.AuthorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/authors")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin - Authors", description = "Admin author management")
public class AdminAuthorController {

    private final AuthorService authorService;

    @PostMapping
    @Operation(summary = "Add a new author")
    public ResponseEntity<ApiResponse<AuthorResponse>> createAuthor(@Valid @RequestBody AuthorCreateRequest request) {
        AuthorResponse response = authorService.createAuthor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Author created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update author details")
    public ResponseEntity<ApiResponse<AuthorResponse>> updateAuthor(
            @PathVariable Long id,
            @Valid @RequestBody AuthorUpdateRequest request) {
        AuthorResponse response = authorService.updateAuthor(id, request);
        return ResponseEntity.ok(ApiResponse.success("Author updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete author")
    public ResponseEntity<ApiResponse<Void>> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.ok(ApiResponse.message("Author deleted successfully"));
    }
}

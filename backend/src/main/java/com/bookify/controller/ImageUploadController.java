package com.bookify.controller;

import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.image.ImageUploadResponse;
import com.bookify.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Tag(name = "Images", description = "Image upload via Cloudinary")
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image to Cloudinary (folder: books, authors, profiles)")
    public ResponseEntity<ApiResponse<ImageUploadResponse>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "books") String folder) {
        ImageUploadResponse response = cloudinaryService.uploadImage(file, folder);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", response));
    }
}

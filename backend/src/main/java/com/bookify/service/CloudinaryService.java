package com.bookify.service;

import com.bookify.dto.response.image.ImageUploadResponse;
import com.bookify.exception.BadRequestException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public ImageUploadResponse uploadImage(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new BadRequestException("Cannot upload empty file");
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "bookify/" + folder,
                    "resource_type", "image"
            ));

            return ImageUploadResponse.builder()
                    .url((String) uploadResult.get("secure_url"))
                    .publicId((String) uploadResult.get("public_id"))
                    .format((String) uploadResult.get("format"))
                    .bytes(uploadResult.get("bytes") != null ? Long.valueOf(uploadResult.get("bytes").toString()) : 0L)
                    .build();
        } catch (IOException e) {
            log.error("Cloudinary upload failed", e);
            throw new BadRequestException("Image upload failed: " + e.getMessage());
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Cloudinary deletion failed for " + publicId, e);
        }
    }
}

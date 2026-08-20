package com.bookify.dto.response.image;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageUploadResponse {
    private String url;
    private String publicId;
    private String format;
    private Long bytes;
}

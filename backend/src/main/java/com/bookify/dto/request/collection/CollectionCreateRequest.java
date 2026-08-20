package com.bookify.dto.request.collection;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionCreateRequest {
    @NotBlank(message = "Collection name is required")
    @Size(max = 200, message = "Collection name cannot exceed 200 characters")
    private String name;
    private String description;
    private Boolean isPublic;
}

package com.bookify.dto.request.author;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorUpdateRequest {
    @NotBlank(message = "Author name is required")
    @Size(max = 150, message = "Author name cannot exceed 150 characters")
    private String name;
    private String biography;
    private String country;
    private LocalDate dateOfBirth;
    private String profileImage;
    private String website;
}

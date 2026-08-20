package com.bookify.dto.request.book;

import com.bookify.entity.BookStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookUpdateRequest {
    @NotBlank(message = "ISBN is required")
    private String isbn;

    @NotBlank(message = "Title is required")
    @Size(max = 300, message = "Title cannot exceed 300 characters")
    private String title;

    private String subtitle;
    private String description;

    @NotNull(message = "Author ID is required")
    private Long authorId;

    private String publisher;
    private LocalDate publicationDate;
    private String language;
    private Integer pageCount;

    @DecimalMin(value = "0.0", message = "Price must be greater than or equal to 0")
    private BigDecimal price;

    private String coverImage;
    private BookStatus status;
    private Set<Long> categoryIds;
}

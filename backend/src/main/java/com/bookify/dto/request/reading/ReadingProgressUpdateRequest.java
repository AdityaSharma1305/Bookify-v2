package com.bookify.dto.request.reading;

import com.bookify.entity.ReadingStatus;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingProgressUpdateRequest {
    private ReadingStatus status;

    @Min(value = 0, message = "Current page must be at least 0")
    private Integer currentPage;
}

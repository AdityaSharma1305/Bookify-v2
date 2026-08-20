package com.bookify.dto.request.reading;

import com.bookify.entity.ReadingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingStatusUpdateRequest {
    @NotNull(message = "Reading status is required")
    private ReadingStatus status;
}

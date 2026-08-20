package com.bookify.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    @Builder.Default
    private Boolean success = false;
    private String message;
    private ErrorCode errorCode;
    private Map<String, String> errors;
    private String path;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}

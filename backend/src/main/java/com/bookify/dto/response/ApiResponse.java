package com.bookify.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    private Boolean success = true;
    private String message;
    private T data;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).timestamp(LocalDateTime.now()).build();
    }
    public static <T> ApiResponse<T> success(T data) {
        return success("Operation successful", data);
    }
    public static <T> ApiResponse<T> message(String message) {
        return ApiResponse.<T>builder().success(true).message(message).timestamp(LocalDateTime.now()).build();
    }
}

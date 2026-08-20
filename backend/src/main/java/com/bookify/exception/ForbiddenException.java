package com.bookify.exception;

import lombok.Getter;

@Getter
public class ForbiddenException extends RuntimeException {
    private final ErrorCode errorCode;

    public ForbiddenException(String message) {
        super(message);
        this.errorCode = ErrorCode.FORBIDDEN;
    }

    public ForbiddenException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

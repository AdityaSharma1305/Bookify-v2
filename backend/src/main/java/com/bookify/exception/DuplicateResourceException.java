package com.bookify.exception;

import lombok.Getter;

@Getter
public class DuplicateResourceException extends RuntimeException {
    private final ErrorCode errorCode;

    public DuplicateResourceException(String message) {
        super(message);
        this.errorCode = ErrorCode.DUPLICATE_RESOURCE;
    }

    public DuplicateResourceException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

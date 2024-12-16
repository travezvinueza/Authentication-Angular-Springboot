package com.ricardo.backend.exception;

public class TokenRefreshNotFoundException extends RuntimeException {
    public TokenRefreshNotFoundException(String message) {
        super(message);
    }
}

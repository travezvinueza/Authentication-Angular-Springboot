package com.ricardo.backend.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCatalog {
    USER_NOT_FOUND("ERROR_USER_001", "User not found"),
    USER_NOT_VALID("ERROR_USER_002", "User not valid"),
    USER_ALREADY_EXISTS("ERROR_USER_003", "User already exists"),
    USER_NOT_ACTIVE("USER_NOT_ACTIVE", "User not active"),
    USER_BLOCKED("USER_BLOCKED", "User blocked"),
    USER_NOT_BLOCKED("USER_NOT_BLOCKED", "User not blocked"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Invalid credentials");
    private final String code;
    private final String message;
}

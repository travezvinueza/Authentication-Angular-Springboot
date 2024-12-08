package com.ricardo.backend.exception;

public class EmailSendNotFoundException extends RuntimeException {
    public EmailSendNotFoundException(String message) {
        super(message);
    }
}

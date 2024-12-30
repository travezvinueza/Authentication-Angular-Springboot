package com.ricardo.backend.data;

import java.util.Set;

public record DefaultUserData(
        String name,
        String password,
        String email,
        String image,
        Set<String> roleNames,
        boolean accountLocked,
        String successMessage) {
}


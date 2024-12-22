package com.ricardo.backend.service;

import com.ricardo.backend.dto.JwtResponse;
import com.ricardo.backend.dto.LoginDto;
import com.ricardo.backend.dto.UserDto;

public interface AuthService {
    JwtResponse login(LoginDto loginDto);

    UserDto register(UserDto userDto);

    String forgotPassword(String email);

    String resetPassword(String otp, String newPassword);
}
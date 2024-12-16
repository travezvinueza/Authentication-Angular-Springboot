package com.ricardo.backend.service;

import com.ricardo.backend.dto.LoginDto;
import com.ricardo.backend.dto.UserDto;
import com.ricardo.backend.dto.ReqRes;

public interface AuthService {
    ReqRes login(LoginDto loginDto);

    ReqRes register(UserDto userDto);

    ReqRes forgotPassword(String email);

    ReqRes resetPassword(String otp, String newPassword);
}
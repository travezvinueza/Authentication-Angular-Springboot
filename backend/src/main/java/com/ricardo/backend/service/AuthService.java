package com.ricardo.backend.service;

import com.ricardo.backend.dto.LoginDto;
import com.ricardo.backend.dto.UserDto;
import com.ricardo.backend.dto.ReqRes;

public interface AuthService {
    ReqRes login(LoginDto loginDto);

    ReqRes register(UserDto userDto);

    String resetPassword(String email);

    String forgetPassword(String otp, String newPassword);
}
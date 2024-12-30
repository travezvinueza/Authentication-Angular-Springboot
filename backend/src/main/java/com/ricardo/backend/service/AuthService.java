package com.ricardo.backend.service;

import com.ricardo.backend.dto.*;

public interface AuthService {
    JwtResponse login(LoginDto loginDto);

    UserDto register(UserDto userDto);

    ForgetPassRequest forgetPassword(ForgetPassRequest forgetPassRequest);

    ResetPassRequest resetPassword(ResetPassRequest resetPassRequest);
}
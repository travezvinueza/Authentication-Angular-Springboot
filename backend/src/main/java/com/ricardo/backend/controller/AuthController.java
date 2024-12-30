package com.ricardo.backend.controller;

import com.ricardo.backend.dto.*;
import com.ricardo.backend.service.AuthService;
import com.ricardo.backend.service.FileUploadService;
import com.ricardo.backend.service.OurUserDetailsService;
import com.ricardo.backend.util.JwtGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtGenerator jwtGenerator;
    private final OurUserDetailsService ourUserDetailsService;
    private final FileUploadService fileUploadService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> register(@RequestPart UserDto userDto,
                                            @RequestPart(required = false) MultipartFile imageProfile) throws IOException {
        String imageFile = (imageProfile != null && !imageProfile.isEmpty()) ? fileUploadService.uploadFile(imageProfile) : null;
        userDto.setImageProfile(imageFile);
        return new ResponseEntity<>(authService.register(userDto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginDto loginDto) {
        return new ResponseEntity<>(authService.login(loginDto), HttpStatus.OK);
    }

    @PostMapping("/forget-password")
    public ResponseEntity<ForgetPassRequest> forgetPassword(@RequestBody ForgetPassRequest request) {
        return new ResponseEntity<>(authService.forgetPassword(request), HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResetPassRequest> resetPassword(@RequestBody ResetPassRequest request) {
        return new ResponseEntity<>(authService.resetPassword(request), HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<JwtResponse> refreshToken(Authentication authentication) {
        UserDetails userDetails = ourUserDetailsService.loadUserByUsername(authentication.getName());
        Map<String, Object> claims = new HashMap<>();
//        claims.put("accountLocked", userDetails.isAccountNonLocked());
        String token = jwtGenerator.generateRefreshToken(claims, userDetails);
        String imageProfile = userDetails.getUsername();
        JwtResponse jwtRefresh = new JwtResponse(token,imageProfile);
        return new ResponseEntity<>(jwtRefresh, HttpStatus.OK);
    }

}
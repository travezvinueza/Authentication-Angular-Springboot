package com.ricardo.backend.controller;

import com.ricardo.backend.dto.LoginDto;
import com.ricardo.backend.dto.UserDto;
import com.ricardo.backend.dto.ReqRes;
import com.ricardo.backend.service.AuthService;
import com.ricardo.backend.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final FileUploadService fileUploadService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReqRes> register(@RequestPart UserDto userDto,
                                           @RequestPart MultipartFile imageProfile) throws IOException {
        String imageFile = fileUploadService.uploadFile(imageProfile);
        userDto.setImageProfile(imageFile);
        return new ResponseEntity<>(authService.register(userDto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ReqRes> login(@RequestBody LoginDto loginDto) {
        return new ResponseEntity<>(authService.login(loginDto), HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email) {
        String response = authService.resetPassword(email);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @PostMapping("/forget-password")
    public ResponseEntity<String> forgetPassword(@RequestParam String otp, @RequestParam String newPassword) {
        String response = authService.forgetPassword(otp, newPassword);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

}
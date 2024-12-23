package com.ricardo.backend.controller;

import com.ricardo.backend.dto.ReqRes;
import com.ricardo.backend.dto.UserDto;
import com.ricardo.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> updateUser(@RequestPart UserDto userDto,
                                              @RequestPart(required = false) MultipartFile newImage) throws IOException {
        return new ResponseEntity<>(userService.updateUser(userDto, newImage), HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<ReqRes> blockUser(@PathVariable Long id) {
        return new ResponseEntity<>(userService.blockUser(id), HttpStatus.OK);
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<ReqRes> unblockUser(@PathVariable Long id) {
        return new ResponseEntity<>(userService.unlockUser(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
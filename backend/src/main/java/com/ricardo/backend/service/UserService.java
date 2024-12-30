package com.ricardo.backend.service;

import com.ricardo.backend.dto.UserDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    UserDto updateUser(UserDto userDto, MultipartFile newImage) throws IOException;

    void deleteUser(Long id);

    List<UserDto> getAllUsers();

    UserDto getUserById(Long id);

    UserDto lockedUser(Long id, boolean locked);
}

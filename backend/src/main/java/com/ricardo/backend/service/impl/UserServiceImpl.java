package com.ricardo.backend.service.impl;

import com.ricardo.backend.dto.UserDto;
import com.ricardo.backend.entity.Role;
import com.ricardo.backend.entity.User;
import com.ricardo.backend.exception.RoleNotFoundException;
import com.ricardo.backend.exception.UserNotFoundException;
import com.ricardo.backend.mapper.UserMapper;
import com.ricardo.backend.repositoty.RoleRepository;
import com.ricardo.backend.repositoty.UserRepository;
import com.ricardo.backend.service.FileUploadService;
import com.ricardo.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileUploadService fileUploadService;

    @Override
    public UserDto updateUser(UserDto userDto, MultipartFile newImage) throws IOException {
        User user = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + userDto.getId()));

        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setAccountLocked(userDto.isAccountLocked());

        // Manejo de nueva imagen
        if (newImage != null && !newImage.isEmpty()) {
            if (user.getImageProfile() != null && !user.getImageProfile().isEmpty()) {
                fileUploadService.deleteUpload(user.getImageProfile());
            }
            String newImageUrl = fileUploadService.uploadFile(newImage);
            user.setImageProfile(newImageUrl);
        }

        // Verificar si hay una nueva contraseña
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        if (userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
            List<Role> roles = userDto.getRoles().stream()
                    .map(roleDto -> roleRepository.findByRoleName(roleDto.getRoleName())
                            .orElseThrow(() -> new RoleNotFoundException("Role not found: " + roleDto.getRoleName())))
                    .collect(Collectors.toList());
            user.setRoles(roles);
        }

        return userMapper.toUserDto(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + id));

        if (user.getImageProfile() != null && !user.getImageProfile().isEmpty()) {
            try {
                fileUploadService.deleteUpload(user.getImageProfile());
            } catch (IOException e) {
                log.error("Error al eliminar la imagen del usuario con ID: {}", id, e);
            }
        }
        userRepository.delete(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserDto)
                .toList();
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + id));
        return userMapper.toUserDto(user);
    }

    @Override
    public UserDto lockedUser(Long id, boolean locked) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        user.setAccountLocked(locked);
        userRepository.save(user);
        return userMapper.toUserDto(user);
    }

}
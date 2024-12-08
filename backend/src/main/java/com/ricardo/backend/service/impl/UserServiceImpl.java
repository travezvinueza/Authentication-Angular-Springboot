package com.ricardo.backend.service.impl;

import com.ricardo.backend.dto.RoleDto;
import com.ricardo.backend.dto.UserDto;
import com.ricardo.backend.entity.Role;
import com.ricardo.backend.entity.User;
import com.ricardo.backend.repositoty.RoleRepository;
import com.ricardo.backend.repositoty.UserRepository;
import com.ricardo.backend.service.FileUploadService;
import com.ricardo.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileUploadService fileUploadService;

    @Override
    public UserDto createUser(UserDto userDto, MultipartFile imageProfile) throws IOException {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new RuntimeException("El usuario ya existe con el email: " + userDto.getEmail());
        }

        List<Role> roles = userDto.getRoles().stream()
                .map(roleDto -> roleRepository.findByRoleName(roleDto.getRoleName())
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleDto.getRoleName())))
                .toList();

        User user = User.builder()
                .username(userDto.getUsername())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .email(userDto.getEmail())
                .roles(roles)
                .build();

        String image = fileUploadService.uploadFile(imageProfile);
        user.setImageProfile(image);
        User savedUser = userRepository.save(user);

        return mapUserToDto(savedUser);
    }

    @Override
    public UserDto updateUser(UserDto userDto, MultipartFile newImage) throws IOException {
        User user = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userDto.getId()));

        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());

        // Si hay una nueva imagen, reemplazar la existente
        if (newImage != null && !newImage.isEmpty()) {
            if (user.getImageProfile() != null) {
                String fileName = extractFileNameFromUrl(user.getImageProfile());
                fileUploadService.deleteUpload(fileName);
            }
            String nuevaImagenUrl = fileUploadService.uploadFile(newImage);
            user.setImageProfile(nuevaImagenUrl);
        }

        // Verificar si hay una nueva contraseña
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        if (userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
            List<Role> roles = userDto.getRoles().stream()
                    .map(roleDto -> roleRepository.findByRoleName(roleDto.getRoleName())
                            .orElseThrow(() -> new RuntimeException("Role not found: " + roleDto.getRoleName())))
                    .collect(Collectors.toList());
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        return mapUserToDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        userRepository.delete(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapUserToDto)
                .toList();
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return mapUserToDto(user);
    }

    // Método auxiliar para mapear User a UserDto
    private UserDto mapUserToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .imageProfile(user.getImageProfile())
                .password(user.getPassword())
                .roles(user.getRoles().stream()
                        .map(role -> RoleDto.builder()
                                .id(role.getId())
                                .roleName(role.getRoleName())
                                .build())
                        .toList())
                .build();
    }

    // Método auxiliar para extraer el nombre del archivo desde una URL
    private String extractFileNameFromUrl(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }
}

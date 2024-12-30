package com.ricardo.backend.mapper.impl;

import com.ricardo.backend.dto.RoleDto;
import com.ricardo.backend.dto.UserDto;
import com.ricardo.backend.entity.Role;
import com.ricardo.backend.entity.User;
import com.ricardo.backend.mapper.UserMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserMapperImpl implements UserMapper {
    @Override
    public User toUser(UserDto userDto) {
        return User.builder()
                .id(userDto.getId())
                .name(userDto.getName())
                .email(userDto.getEmail())
                .password(userDto.getPassword())
                .imageProfile(userDto.getImageProfile())
                .creationDate(userDto.getCreationDate())
                .roles(userDto.getRoles() != null ?
                        userDto.getRoles().stream()
                                .map(roleDto -> Role.builder()
                                        .id(roleDto.getId())
                                        .roleName(roleDto.getRoleName())
                                        .build())
                                .toList()
                        : new ArrayList<>())
                .accountLocked(userDto.isAccountLocked())
                .build();
    }

    @Override
    public UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .password(user.getPassword())
                .imageProfile(user.getImageProfile())
                .creationDate(user.getCreationDate())
                .roles(user.getRoles().stream()
                        .map(role -> RoleDto.builder()
                                .id(role.getId())
                                .roleName(role.getRoleName())
                                .build())
                        .toList())
                .accountLocked(user.isAccountLocked())
                .build();
    }

    @Override
    public List<UserDto> toUserDtoList(List<User> users) {
        return users.stream().map(this::toUserDto).toList();
    }

    @Override
    public void updateUser(User user, UserDto userDto) {
        user.setId(userDto.getId());
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setImageProfile(userDto.getImageProfile());
        user.setAccountLocked(userDto.isAccountLocked());
    }

}

package com.ricardo.backend.mapper;

import com.ricardo.backend.dto.UserDto;
import com.ricardo.backend.entity.User;

import java.util.List;

public interface UserMapper {
    User toUser(UserDto userDto);

    UserDto toUserDto(User user);

    List<UserDto> toUserDtoList(List<User> users);

    void updateUser(User user, UserDto userDto);
}

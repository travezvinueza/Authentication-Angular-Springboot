package com.ricardo.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String imageProfile;
    private List<RoleDto> roles;
    private boolean accountLocked;
}

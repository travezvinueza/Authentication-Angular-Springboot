package com.ricardo.backend.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleDto {
    private Long id;
    private String roleName;

    public RoleDto(String roleName) {
        this.roleName = roleName;
    }
}

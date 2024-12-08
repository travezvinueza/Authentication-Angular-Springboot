package com.ricardo.backend.service;

import com.ricardo.backend.dto.RoleDto;

import java.util.List;


public interface RoleService {
    RoleDto createRole(RoleDto roleDto);

    RoleDto updateRole(RoleDto roleDto);

    void deleteRole(Long id);

    List<RoleDto> getAllRoles();

    RoleDto getRoleById(Long id);
}

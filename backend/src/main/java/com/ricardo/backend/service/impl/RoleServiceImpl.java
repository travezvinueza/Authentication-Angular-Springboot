package com.ricardo.backend.service.impl;

import com.ricardo.backend.dto.RoleDto;
import com.ricardo.backend.entity.Role;
import com.ricardo.backend.exception.RoleNotFoundException;
import com.ricardo.backend.repositoty.RoleRepository;
import com.ricardo.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public RoleDto createRole(RoleDto roleDto) {
        Role existingRole = roleRepository.findByRoleName(roleDto.getRoleName()).orElse(null);
        if (existingRole != null) {
            throw new RoleNotFoundException("El rol ya existe");
        }

        Role role = new Role();
        role.setRoleName(roleDto.getRoleName());
        roleRepository.save(role);

        return RoleDto.builder()
                .id(role.getId())
                .roleName(roleDto.getRoleName())
                .build();

    }

    @Override
    public RoleDto updateRole(RoleDto roleDto) {
        Role existingRole = roleRepository.findById(roleDto.getId())
                .orElseThrow(() -> new RoleNotFoundException("Rol no encontrado"));

        existingRole.setRoleName(roleDto.getRoleName());
        roleRepository.save(existingRole);

        return RoleDto.builder()
                .id(existingRole.getId())
                .roleName(existingRole.getRoleName())
                .build();
    }

    @Override
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id).orElseThrow(null);
        roleRepository.delete(role);
    }

    @Override
    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(role -> RoleDto.builder()
                        .id(role.getId())
                        .roleName(role.getRoleName())
                        .build())
                .toList();
    }

    @Override
    public RoleDto getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException("Rol no encontrado"));
        return RoleDto.builder()
                .id(role.getId())
                .roleName(role.getRoleName())
                .build();
    }

}
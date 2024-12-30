package com.ricardo.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String password;
    private String email;
    private String imageProfile;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS", timezone = "America/Guayaquil")
    private Timestamp creationDate;
    private List<RoleDto> roles;
    private boolean accountLocked;
}

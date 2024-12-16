package com.ricardo.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqRes {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String imageProfile;
    private String otp;

    private int statusCode;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private List<RoleDto> roles;
    private boolean accountLocked;

}

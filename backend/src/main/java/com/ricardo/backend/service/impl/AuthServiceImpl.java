package com.ricardo.backend.service.impl;

import com.ricardo.backend.dto.*;
import com.ricardo.backend.entity.Role;
import com.ricardo.backend.entity.User;
import com.ricardo.backend.exception.RoleNotFoundException;
import com.ricardo.backend.exception.UserNotFoundException;
import com.ricardo.backend.repositoty.RoleRepository;
import com.ricardo.backend.repositoty.UserRepository;
import com.ricardo.backend.service.AuthService;
import com.ricardo.backend.service.EmailService;
import com.ricardo.backend.util.JwtHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtHelper jwtHelper;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();
    private final EmailService emailService;

    @Override
    public ReqRes login(LoginDto loginDto) {
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );

            User user = userRepository.findByUsername(loginDto.getUsername()).orElseThrow();
            if(user.isAccountLocked()){
                return ReqRes.builder()
                        .statusCode(401)
                        .message("La cuenta está bloqueada. Por favor, contacte con soporte.")
                        .build();
            }
            String jwt = jwtHelper.generateToken(user);
//            String refreshToken = jwtHelper.generateRefreshToken(new HashMap<>(), user);

            return ReqRes.builder()
                    .statusCode(200)
                    .message("Inicio de sesion exitoso")
                    .token(jwt)
                    .roles(user.getRoles().stream()
                            .map(role -> new RoleDto(role.getId(), role.getRoleName()))
                            .toList())
//                    .refreshToken(refreshToken)
                    .expirationTime("24Horas")
                    .imageProfile(user.getImageProfile())
                    .build();
        } catch (BadCredentialsException e) {
            throw new UserNotFoundException("Credenciales inválidas");
        } catch (Exception e) {
            throw new UserNotFoundException("Error al autenticar el usuario: " + e.getMessage());
        }
    }

    @Override
    public ReqRes register(UserDto userDto) {
        try {

            if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
                throw new UserNotFoundException("El usuario ya existe");
            }

            Role defaultRole = roleRepository.findByRoleName("USER")
                    .orElseThrow(() -> new RoleNotFoundException("Rol predeterminado 'USER' no encontrado"));

            List<Role> roles = userDto.getRoles() != null && !userDto.getRoles().isEmpty()
                    ? userDto.getRoles().stream()
                    .map(roleDto -> roleRepository.findByRoleName(roleDto.getRoleName())
                            .orElseThrow(() -> new RoleNotFoundException("Rol no encontrado: " + roleDto.getRoleName())))
                    .toList()
                    : List.of(defaultRole);

            User newUser = User.builder()
                    .username(userDto.getUsername())
                    .password(passwordEncoder.encode(userDto.getPassword()))
                    .email(userDto.getEmail())
                    .imageProfile(userDto.getImageProfile())
                    .roles(roles)
                    .accountLocked(false)
                    .build();

            User savedUser = userRepository.save(newUser);

            return ReqRes.builder()
                    .id(savedUser.getId())
                    .username(savedUser.getUsername())
                    .password(savedUser.getPassword())
                    .imageProfile(savedUser.getImageProfile())
                    .email(savedUser.getEmail())
                    .otp(savedUser.getOtp())
                    .roles(savedUser.getRoles().stream()
                            .map(role -> new RoleDto(role.getId(), role.getRoleName()))
                            .toList())
                    .message("Usuario registrado exitosamente")
                    .statusCode(200)
                    .accountLocked(savedUser.isAccountLocked())
                    .build();
        } catch (Exception e) {
            throw new UserNotFoundException("Error al registrar el usuario: " + e.getMessage());
        }
    }

    @Override
    public ReqRes forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String otp = generateOTP();
        user.setOtp(otp);
        userRepository.save(user);

        String subject = "Restablecimiento de contraseña";
        String body = "Tu OTP para restablecer la contraseña es: " + otp;
        emailService.sendEmail(email, subject, body);

        return ReqRes.builder()
                .statusCode(200)
                .message("OTP enviado con éxito")
                .build();
    }

    @Override
    public ReqRes resetPassword(String otp, String newPassword) {
        User userOtp = userRepository.findByOtp(otp)
                .orElseThrow(() -> new RuntimeException("OTP no encontrado"));

        userOtp.setPassword(passwordEncoder.encode(newPassword));
        userOtp.setOtp(null);
        userRepository.save(userOtp);

        return ReqRes.builder()
                .statusCode(200)
                .message("Contraseña restablecida exitosamente")
                .build();
    }

    private String generateOTP() {
        int otpValue = secureRandom.nextInt(900000) + 100000;
        return String.valueOf(otpValue);
    }

}
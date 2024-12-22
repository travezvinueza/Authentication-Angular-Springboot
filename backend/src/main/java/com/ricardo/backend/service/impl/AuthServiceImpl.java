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
import com.ricardo.backend.util.JwtGenerator;
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
    private final JwtGenerator jwtGenerator;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();
    private final EmailService emailService;

    @Override
    public JwtResponse login(LoginDto loginDto) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );

            User user = userRepository.findByUsername(loginDto.getUsername()).orElseThrow();
            if (user.isAccountLocked()) {
                throw new UserNotFoundException("Cuenta bloqueada");
            }
            String jwt = jwtGenerator.generateToken(user);
            String imageProfile = user.getImageProfile();
 //          String refreshToken = jwtGenerator.generateRefreshToken(new HashMap<>(), user);

            return new JwtResponse(jwt, imageProfile);
        } catch (BadCredentialsException e) {
            throw new UserNotFoundException("Credenciales inválidas");
        }
    }

    @Override
    public UserDto register(UserDto userDto) {
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

        User newUser = new User();
        newUser.setUsername(userDto.getUsername());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setEmail(userDto.getEmail());
        newUser.setImageProfile(userDto.getImageProfile());
        newUser.setRoles(roles);
        newUser.setAccountLocked(false);

        userRepository.save(newUser);
        return userDto;
    }

    @Override
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String otp = generateOTP();
        user.setOtp(otp);
        userRepository.save(user);

        String subject = "Restablecimiento de contraseña";
        String body = "Tu OTP para restablecer la contraseña es: " + otp;
        emailService.sendEmail(email, subject, body);
        return "Se a enviado un OTP al correo: " + email;
    }

    @Override
    public String resetPassword(String otp, String newPassword) {
        User userOtp = userRepository.findByOtp(otp)
                .orElseThrow(() -> new RuntimeException("OTP no encontrado"));

        userOtp.setPassword(passwordEncoder.encode(newPassword));
        userOtp.setOtp(null);
        userRepository.save(userOtp);
        return "Contraseña restablecida exitosamente";
    }

    private String generateOTP() {
        int otpValue = secureRandom.nextInt(900000) + 100000;
        return String.valueOf(otpValue);
    }

}
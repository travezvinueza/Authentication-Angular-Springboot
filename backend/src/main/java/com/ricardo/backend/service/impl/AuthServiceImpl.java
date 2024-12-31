package com.ricardo.backend.service.impl;

import com.ricardo.backend.dto.*;
import com.ricardo.backend.entity.Role;
import com.ricardo.backend.entity.User;
import com.ricardo.backend.exception.AccountLockedException;
import com.ricardo.backend.exception.RoleNotFoundException;
import com.ricardo.backend.exception.UserNotFoundException;
import com.ricardo.backend.repository.RoleRepository;
import com.ricardo.backend.repository.UserRepository;
import com.ricardo.backend.service.AuthService;
import com.ricardo.backend.service.EmailService;
import com.ricardo.backend.util.JwtGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getEmail(),
                            loginDto.getPassword())
            );

            User user = (User) authentication.getPrincipal();
            String accessToken = jwtGenerator.generateToken(user);
 //          String refreshToken = jwtGenerator.generateRefreshToken(new HashMap<>(), user);

            return new JwtResponse(accessToken, user.getImageProfile());
        } catch (LockedException e) {
            throw new AccountLockedException("La cuenta está bloqueada. Contacta al administrador.");
        } catch (BadCredentialsException e) {
            throw new UserNotFoundException("Usuario o contraseña incorrectos.");
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
        newUser.setName(userDto.getName());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setEmail(userDto.getEmail());
        newUser.setImageProfile(userDto.getImageProfile());
        newUser.setCreationDate(userDto.getCreationDate());
        newUser.setRoles(roles);
        newUser.setAccountLocked(false);

        userRepository.save(newUser);
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userDto.setCreationDate(newUser.getCreationDate());
        return userDto;
    }

    @Override
    public ForgetPassRequest forgetPassword(ForgetPassRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String otp = generateOTP();
        user.setOtp(otp);
        userRepository.save(user);

        String subject = "Restablecimiento de contraseña";
        String body = "Tu OTP para restablecer la contraseña es: " + otp;
        emailService.sendEmail(request.getEmail(), subject, body);
        return request;
    }

    @Override
    public ResetPassRequest resetPassword(ResetPassRequest request) {
        User userOtp = userRepository.findByOtp(request.getOtp())
                .orElseThrow(() -> new RuntimeException("OTP no encontrado"));

        userOtp.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userOtp.setOtp(null);
        userRepository.save(userOtp);
        return request;
    }

    private String generateOTP() {
        int otpValue = secureRandom.nextInt(900000) + 100000;
        return String.valueOf(otpValue);
    }

}
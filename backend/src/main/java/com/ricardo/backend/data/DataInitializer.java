package com.ricardo.backend.data;

import com.ricardo.backend.entity.Role;
import com.ricardo.backend.entity.User;
import com.ricardo.backend.repositoty.RoleRepository;
import com.ricardo.backend.repositoty.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@Transactional
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
        createDefaultRoles(Set.of("ADMIN", "USER"));

        createDefaultUserIfNotExists(
                "Ricardo", "123456", "travezvinueza@gmail.com", Set.of("ADMIN"),
                "Administrador creado correctamente: Ricardo/123456"
        );

        createDefaultUserIfNotExists(
                "Evelin", "evelin123", "evelin@gmail.com", Set.of("USER"),
                "Usuario creado correctamente: Evelin/evelin123"
        );
    }

    private void createDefaultRoles(Set<String> roles) {
        roles.stream()
                .filter(role -> roleRepository.findByRoleName(role).isEmpty())
                .map(Role::new)
                .forEach(roleRepository::save);
    }

    private void createDefaultUserIfNotExists(
            String username, String password, String email, Set<String> roleNames, String successMessage
    ) {
        if (userRepository.findByUsername(username).isEmpty()) {
            List<Role> roles = roleNames.stream()
                    .map(roleName -> roleRepository.findByRoleName(roleName)
                            .orElseThrow(() -> new RuntimeException("El rol " + roleName + " no fue encontrado")))
                    .toList();

            User user = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode(password))
                    .email(email)
                    .roles(roles)
                    .build();

            userRepository.save(user);
            System.out.println(successMessage);
        } else {
            System.out.println("Usuario ya existente: " + username + roleNames);
        }
    }

}
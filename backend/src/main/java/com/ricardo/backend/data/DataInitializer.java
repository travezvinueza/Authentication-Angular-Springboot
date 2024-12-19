package com.ricardo.backend.data;

import com.ricardo.backend.entity.Role;
import com.ricardo.backend.entity.User;
import com.ricardo.backend.repositoty.RoleRepository;
import com.ricardo.backend.repositoty.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Slf4j
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

        createDefaultUserIfNotExists(new DefaultUserData(
                "Ricardo", "123456", "travezvinueza@gmail.com",
                "https://res.cloudinary.com/duzogl1l3/image/upload/v1725165057/anonimus_pzvrq1.jpg", Set.of("ADMIN"),
                false,
                "Administrador creado correctamente: Ricardo/123456"
        ));

        createDefaultUserIfNotExists(new DefaultUserData(
                "Evelin", "evelin123", "evelinvera@gmail.com",
                "https://res.cloudinary.com/duzogl1l3/image/upload/v1725165333/Evelin_orfwci.jpg", Set.of("USER"),
                false,
                "Usuario creado correctamente: Evelin/evelin123"
        ));
    }

    private void createDefaultRoles(Set<String> roles) {
        roles.stream()
                .filter(role -> roleRepository.findByRoleName(role).isEmpty())
                .map(Role::new)
                .forEach(roleRepository::save);
    }

    private void createDefaultUserIfNotExists(DefaultUserData userData) {
        if (userRepository.findByUsername(userData.username()).isEmpty()) {
            List<Role> roles = userData.roleNames().stream()
                    .map(roleName -> roleRepository.findByRoleName(roleName)
                            .orElseThrow(() -> new RuntimeException("El rol " + roleName + " no fue encontrado")))
                    .toList();

            User user = User.builder()
                    .username(userData.username())
                    .password(passwordEncoder.encode(userData.password()))
                    .email(userData.email())
                    .imageProfile(userData.image())
                    .roles(roles)
                    .accountLocked(userData.accountLocked())
                    .build();

            userRepository.save(user);
            log.info(userData.successMessage());
        } else {
            log.info("El usuario ya existente: {}{}", userData.username(), userData.roleNames());
        }
    }
}
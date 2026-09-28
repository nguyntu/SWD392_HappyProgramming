package com.happyprogramming.config;

import com.happyprogramming.entity.User;
import com.happyprogramming.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@happyprogramming.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Quản Trị Viên (Admin)")
                    .phone("0901234567")
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(admin);
            log.info("Initialized default ADMIN account: admin / admin123");
        }

        if (!userRepository.existsByUsername("mentor1")) {
            User mentor = User.builder()
                    .username("mentor1")
                    .email("mentor1@happyprogramming.com")
                    .password(passwordEncoder.encode("123456"))
                    .fullName("Mentor Nguyễn Thành Long")
                    .phone("0912345678")
                    .role("ROLE_MENTOR")
                    .build();
            userRepository.save(mentor);
            log.info("Initialized default MENTOR account: mentor1 / 123456");
        }

        if (!userRepository.existsByUsername("student1")) {
            User student = User.builder()
                    .username("student1")
                    .email("student1@happyprogramming.com")
                    .password(passwordEncoder.encode("123456"))
                    .fullName("Học Viên Lê Hoàng Nam")
                    .phone("0987654321")
                    .role("ROLE_USER")
                    .build();
            userRepository.save(student);
            log.info("Initialized default STUDENT account: student1 / 123456");
        }
    }
}

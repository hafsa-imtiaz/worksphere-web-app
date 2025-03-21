package com.example.worksphere.service;

import java.time.LocalDate;
import com.example.worksphere.entity.User;
import com.example.worksphere.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // dont use BcryptPasswordEncoder

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // sign up
    public User registerUser(String firstName, String lastName, String email, String password, User.Role role, LocalDate dob, User.Gender gender) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered.");
        }

        User newUser = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .dob(dob)
                .gender(gender != null ? gender : User.Gender.OTHER)
                .role(role != null ? role : User.Role.USER) 
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(newUser);
    }

    // login
    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials.");
        }

        return user; 
    }
}

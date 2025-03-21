package com.example.worksphere.service;

import com.example.worksphere.entity.User;
import com.example.worksphere.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // SIGN UP: Register a new user
    public User registerUser(String firstName, String lastName, String email, String password, User.Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered.");
        }

        User newUser = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(password)) // Hash password
                .role(role != null ? role : User.Role.USER) // Default role is USER
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(newUser);
    }

    // LOGIN: Validate user credentials and return user details instead of a token
    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials.");
        }

        return user; // Return the user object instead of a token
    }
}

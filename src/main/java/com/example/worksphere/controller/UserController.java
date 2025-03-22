package com.example.worksphere.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.worksphere.dto.SignUpDto;
import com.example.worksphere.entity.User;
import com.example.worksphere.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // SIGN UP: Register a new user
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpDto signUpDto) {
        try {
            // Convert gender string to User.Gender enum
            User.Gender gender = User.Gender.valueOf(signUpDto.getGender().toUpperCase());

            User user = userService.registerUser(
                signUpDto.getFirstName(),
                signUpDto.getLastName(),
                signUpDto.getEmail(),
                signUpDto.getPassword(),
                User.Role.USER, 
                signUpDto.getDob(), 
                gender // Pass gender as User.Gender enum
            );

            System.out.println("User registered:\n" + user);
            return new ResponseEntity<>("User registered successfully.", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid gender value.", HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



    // LOGIN: Authenticate user
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody SignUpDto signUpDto) {
        try {
            // authenticate
            User user = userService.loginUser(
                signUpDto.getEmail(),
                signUpDto.getPassword()
            );
            return new ResponseEntity<>("Login successful. Welcome " + user.getFirstName(), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

}

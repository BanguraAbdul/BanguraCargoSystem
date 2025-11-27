package com.bangura.cargo.controller;

import com.bangura.cargo.dto.AuthResponse;
import com.bangura.cargo.dto.LoginRequest;
import com.bangura.cargo.dto.RegisterRequest;
import com.bangura.cargo.model.User;
import com.bangura.cargo.service.UserService;
import com.bangura.cargo.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            return ResponseEntity.ok(java.util.Map.of(
                "message", "Registration successful. Awaiting approval.",
                "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "message", e.getMessage(),
                "success", false
            ));
        }
    }
    
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
        System.out.println("🔵 AuthController - Login request received for email: " + request.getEmail());
        try {
            System.out.println("🔐 AuthController - Attempting authentication...");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            System.out.println("✅ AuthController - Authentication successful");
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtUtil.generateToken(userDetails);
            System.out.println("🔑 AuthController - JWT token generated");
            
            User user = userService.getUserByEmail(request.getEmail());
            System.out.println("👤 AuthController - User loaded: " + user.getEmail() + ", Role: " + user.getRole() + ", Status: " + user.getStatus());
            
            if (user.getStatus() != User.UserStatus.APPROVED) {
                System.out.println("❌ AuthController - User not approved");
                return ResponseEntity.badRequest().body("Account is not approved yet");
            }
            
            AuthResponse response = new AuthResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getStatus().name()
            );
            
            System.out.println("✅ AuthController - Returning success response");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ AuthController - Login failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }
}

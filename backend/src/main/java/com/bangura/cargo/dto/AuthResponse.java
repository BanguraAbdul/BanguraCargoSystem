package com.bangura.cargo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String role;
    private String status;
    
    public AuthResponse(String token, Long id, String email, String role, String status) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.role = role;
        this.status = status;
    }
}

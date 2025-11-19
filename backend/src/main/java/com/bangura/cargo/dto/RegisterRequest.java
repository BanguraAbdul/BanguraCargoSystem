package com.bangura.cargo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
    
    @Email
    @NotBlank
    private String email;
    
    @Pattern(regexp = "^\\+232\\d{8}$", message = "Contact must start with +232 followed by 8 digits")
    private String contact;
    
    @NotBlank
    private String address;
    
    @NotBlank
    private String password;
    
    private String role;
}

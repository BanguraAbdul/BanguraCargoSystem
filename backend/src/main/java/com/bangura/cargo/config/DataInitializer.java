package com.bangura.cargo.config;

import com.bangura.cargo.model.User;
import com.bangura.cargo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create Super Admin if not exists
        if (!userRepository.existsByEmail("superadmin@bangura.com")) {
            User superAdmin = new User();
            superAdmin.setFirstName("Super");
            superAdmin.setLastName("Admin");
            superAdmin.setEmail("superadmin@bangura.com");
            superAdmin.setContact("+23276543210");
            superAdmin.setAddress("Freetown, Sierra Leone");
            superAdmin.setPassword(passwordEncoder.encode("admin123"));
            superAdmin.setRole(User.UserRole.SUPER_ADMIN);
            superAdmin.setStatus(User.UserStatus.APPROVED);
            userRepository.save(superAdmin);
            System.out.println("✅ Super Admin created successfully!");
            System.out.println("📧 Email: superadmin@bangura.com");
            System.out.println("🔑 Password: admin123");
        } else {
            System.out.println("ℹ️  Super Admin already exists");
        }
    }
}

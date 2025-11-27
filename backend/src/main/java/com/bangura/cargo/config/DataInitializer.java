package com.bangura.cargo.config;

import com.bangura.cargo.model.ProductType;
import com.bangura.cargo.model.User;
import com.bangura.cargo.repository.ProductTypeRepository;
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
    private ProductTypeRepository productTypeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create Product Types if not exist
        if (productTypeRepository.count() == 0) {
            ProductType electronics = new ProductType();
            electronics.setName("Electronics");
            electronics.setDescription("Phones, laptops, gadgets");
            productTypeRepository.save(electronics);

            ProductType documents = new ProductType();
            documents.setName("Documents");
            documents.setDescription("Papers, certificates, files");
            productTypeRepository.save(documents);

            ProductType clothing = new ProductType();
            clothing.setName("Clothing");
            clothing.setDescription("Clothes, shoes, accessories");
            productTypeRepository.save(clothing);

            ProductType food = new ProductType();
            food.setName("Food Items");
            food.setDescription("Non-perishable food items");
            productTypeRepository.save(food);

            System.out.println("✅ Product types created successfully!");
        } else {
            System.out.println("ℹ️  Product types already exist");
        }

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

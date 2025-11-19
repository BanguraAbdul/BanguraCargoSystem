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
            System.out.println("Super Admin created: superadmin@bangura.com / admin123");
        }
        
        // Create default product types if not exist
        if (productTypeRepository.count() == 0) {
            ProductType electronics = new ProductType();
            electronics.setName("Electronics");
            electronics.setDescription("Electronic devices and gadgets");
            productTypeRepository.save(electronics);
            
            ProductType documents = new ProductType();
            documents.setName("Documents");
            documents.setDescription("Important papers and documents");
            productTypeRepository.save(documents);
            
            ProductType clothing = new ProductType();
            clothing.setName("Clothing");
            clothing.setDescription("Clothes and textiles");
            productTypeRepository.save(clothing);
            
            ProductType food = new ProductType();
            food.setName("Food Items");
            food.setDescription("Perishable and non-perishable food");
            productTypeRepository.save(food);
            
            System.out.println("Default product types created");
        }
    }
}

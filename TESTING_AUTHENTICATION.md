# Testing Authentication - Complete Guide

## Important Notes

### User Registration Flow
1. Users register with status **PENDING**
2. They must be **APPROVED** by a Super Admin before they can login
3. Only **CUSTOMER** and **ADMIN** roles can self-register
4. **SUPER_ADMIN** must be created directly in the database or via initialization

### Current Issue
The error you're experiencing is likely because:
- You registered a user but they're still in PENDING status
- You need a SUPER_ADMIN to approve users before they can login

## Solution: Create Initial Super Admin

### Option 1: Add Data Initialization Class (Recommended)

Create a file: `backend/src/main/java/com/bangura/cargo/config/DataInitializer.java`

```java
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
        }
    }
}
```

### Option 2: Direct Database Insert

If using H2 database, you can insert directly via SQL:

```sql
INSERT INTO users (first_name, last_name, email, contact, address, password, role, status, created_at)
VALUES ('Super', 'Admin', 'superadmin@bangura.com', '+23276543210', 'Freetown, Sierra Leone', 
        '$2a$10$encoded_password_here', 'SUPER_ADMIN', 'APPROVED', CURRENT_TIMESTAMP);
```

## Testing Steps

### Step 1: Start Servers
```bash
# Backend
cd backend
./gradlew bootRun

# Frontend
cd frontend
npm start
```

### Step 2: Access Application
Open browser: http://localhost:4200

### Step 3: Test Super Admin Login
1. Click "Log In" button
2. Select "Super Admin" role
3. Email: `superadmin@bangura.com`
4. Password: `admin123`
5. Click "Sign In"
6. Should redirect to Super Admin Dashboard

### Step 4: Register Customer
1. Click "Sign Up" button
2. Fill in the form:
   - Register As: **Customer**
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Contact: `+23276111111`
   - Address: `123 Main St, Freetown`
   - Password: `password123`
3. Click "Create Account"
4. Should see success message: "Your account is pending approval"

### Step 5: Approve Customer (as Super Admin)
1. Login as Super Admin
2. Go to Super Admin Dashboard
3. Find "Pending Customers" section
4. Click "Approve" button for John Doe
5. User status changes to APPROVED

### Step 6: Test Customer Login
1. Logout from Super Admin
2. Click "Log In"
3. Select "Customer" role
4. Email: `john@example.com`
5. Password: `password123`
6. Click "Sign In"
7. Should redirect to Customer Dashboard

### Step 7: Register Admin
1. Click "Sign Up" button
2. Fill in the form:
   - Register As: **Admin**
   - First Name: `Jane`
   - Last Name: `Smith`
   - Email: `jane@example.com`
   - Contact: `+23276222222`
   - Address: `456 Oak Ave, Freetown`
   - Password: `admin456`
3. Click "Create Account"

### Step 8: Approve Admin (as Super Admin)
1. Login as Super Admin
2. Go to Super Admin Dashboard
3. Find "Pending Admins" section
4. Click "Approve" button for Jane Smith

### Step 9: Test Admin Login
1. Logout
2. Click "Log In"
3. Select "Admin" role
4. Email: `jane@example.com`
5. Password: `admin456`
6. Click "Sign In"
7. Should redirect to Admin Dashboard

## Common Errors and Solutions

### Error: "Account is not approved yet"
**Cause**: User is still in PENDING status
**Solution**: Login as Super Admin and approve the user

### Error: "Invalid credentials"
**Cause**: Wrong email/password or wrong role selected
**Solution**: 
- Check email and password are correct
- Ensure you selected the correct role (Customer/Admin/Super Admin)

### Error: "Email already exists"
**Cause**: Trying to register with an email that's already in the system
**Solution**: Use a different email address

### Error: "Cannot connect to server"
**Cause**: Backend is not running
**Solution**: Start backend with `./gradlew bootRun`

## Test Data Summary

| Role | Email | Password | Status |
|------|-------|----------|--------|
| SUPER_ADMIN | superadmin@bangura.com | admin123 | APPROVED |
| CUSTOMER | john@example.com | password123 | PENDING → APPROVED |
| ADMIN | jane@example.com | admin456 | PENDING → APPROVED |

## API Endpoints for Testing

### Register
```
POST http://localhost:8080/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "contact": "+23276333333",
  "address": "Test Address",
  "password": "test123",
  "role": "CUSTOMER"
}
```

### Login
```
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "email": "superadmin@bangura.com",
  "password": "admin123"
}
```

### Approve User (Super Admin only)
```
PUT http://localhost:8080/super-admin/users/{userId}/approve
Authorization: Bearer {token}
```

## Next Steps After Testing

1. ✅ Verify all three roles can login successfully
2. ✅ Test role-based access control
3. ✅ Test shipment creation for customers
4. ✅ Test admin approval workflows
5. ✅ Test super admin user management

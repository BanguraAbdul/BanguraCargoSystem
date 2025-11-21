package com.bangura.cargo.controller;

import com.bangura.cargo.model.ProductType;
import com.bangura.cargo.model.User;
import com.bangura.cargo.service.ProductTypeService;
import com.bangura.cargo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@RestController
@RequestMapping("/super-admin")
@CrossOrigin(origins = "http://localhost:4200")
public class SuperAdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProductTypeService productTypeService;
    
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @RequestMapping(value = "/users/pending-admins", method = RequestMethod.GET)
    public ResponseEntity<List<User>> getPendingAdmins() {
        return ResponseEntity.ok(userService.getPendingAdmins());
    }
    
    @RequestMapping(value = "/users/{userId}/approve", method = RequestMethod.POST)
    public ResponseEntity<?> approveAdmin(@PathVariable Long userId) {
        try {
            User user = userService.approveUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/users/{userId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            
            // Prevent deleting super admins
            if (user.getRole() == User.UserRole.SUPER_ADMIN) {
                return ResponseEntity.badRequest().body("Cannot delete super admin users");
            }
            
            userService.deleteUser(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/product-types", method = RequestMethod.POST)
    public ResponseEntity<?> createProductType(@RequestBody ProductType productType) {
        try {
            ProductType created = productTypeService.createProductType(productType);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/product-types", method = RequestMethod.GET)
    public ResponseEntity<List<ProductType>> getAllProductTypes() {
        return ResponseEntity.ok(productTypeService.getAllProductTypes());
    }
    
    @RequestMapping(value = "/product-types/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateProductType(@PathVariable Long id, @RequestBody ProductType productType) {
        try {
            ProductType updated = productTypeService.updateProductType(id, productType);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/product-types/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteProductType(@PathVariable Long id) {
        try {
            productTypeService.deleteProductType(id);
            return ResponseEntity.ok("Product type deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

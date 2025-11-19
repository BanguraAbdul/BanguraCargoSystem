package com.bangura.cargo.service;

import com.bangura.cargo.dto.RegisterRequest;
import com.bangura.cargo.model.User;
import com.bangura.cargo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserManager implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setContact(request.getContact());
        user.setAddress(request.getAddress());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            user.setRole(User.UserRole.ADMIN);
        } else {
            user.setRole(User.UserRole.CUSTOMER);
        }

        user.setStatus(User.UserStatus.PENDING);

        return userRepository.save(user);
    }


    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getStatus() != User.UserStatus.DELETED)
                .collect(java.util.stream.Collectors.toList());
    }
    @Override
    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }
    @Override
    public List<User> getUsersByStatus(User.UserStatus status) {
        return userRepository.findByStatus(status);
    }
    @Override
    public List<User> getPendingAdmins() {
        return userRepository.findByRoleAndStatus(User.UserRole.ADMIN, User.UserStatus.PENDING);
    }
    @Override
    public List<User> getPendingCustomers() {
        return userRepository.findByRoleAndStatus(User.UserRole.CUSTOMER, User.UserStatus.PENDING);
    }
    @Override
    public User approveUser(Long userId) {
        User user = getUserById(userId);
        user.setStatus(User.UserStatus.APPROVED);
        return userRepository.save(user);
    }
    @Override
    public User updateUser(Long userId, User updatedUser) {
        User user = getUserById(userId);
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setContact(updatedUser.getContact());
        user.setAddress(updatedUser.getAddress());
        return userRepository.save(user);
    }
    @Override
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        user.setStatus(User.UserStatus.DELETED);
        userRepository.save(user);
    }
}

package com.bangura.cargo.service;

import com.bangura.cargo.dto.RegisterRequest;
import com.bangura.cargo.model.User;

import java.util.List;

public interface UserService {

    User registerUser(RegisterRequest request);

    User getUserById(Long id);

    User getUserByEmail(String email);

    List<User> getAllUsers();

    List<User> getUsersByRole(User.UserRole role);

    List<User> getUsersByStatus(User.UserStatus status);

    List<User> getPendingAdmins();

    List<User> getPendingCustomers();

    User approveUser(Long userId);

    User updateUser(Long userId, User updatedUser);

    void deleteUser(Long userId);
}

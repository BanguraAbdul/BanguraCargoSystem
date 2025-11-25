# Quick Authentication Test Guide

## ✅ Servers Running
- **Frontend**: http://localhost:4200
- **Backend**: http://localhost:8080/api

## 🔑 Test Credentials

### Super Admin (Already Exists)
- **Email**: superadmin@bangura.com
- **Password**: admin123
- **Role**: Select "Super Admin" when logging in

## 📝 Testing Steps

### 1. Test Super Admin Login
1. Open http://localhost:4200
2. Click "Log In" button (top right)
3. In the modal:
   - Select Role: **Super Admin**
   - Email: `superadmin@bangura.com`
   - Password: `admin123`
4. Click "Sign In"
5. ✅ Should redirect to Super Admin Dashboard

### 2. Register a Customer
1. Click "Sign Up" button
2. Fill the form:
   - Register As: **Customer**
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@test.com`
   - Contact: `+23276111111`
   - Address: `123 Main St, Freetown`
   - Password: `password123`
3. Click "Create Account"
4. ✅ Should see success message
5. ✅ Modal should automatically switch to login

### 3. Approve the Customer
1. Login as Super Admin (if not already)
2. In Super Admin Dashboard, find "Pending Customers" section
3. Find John Doe in the list
4. Click the "Approve" button (checkmark icon)
5. ✅ User status should change to APPROVED

### 4. Test Customer Login
1. Logout (if logged in)
2. Click "Log In"
3. In the modal:
   - Select Role: **Customer**
   - Email: `john@test.com`
   - Password: `password123`
4. Click "Sign In"
5. ✅ Should redirect to Customer Dashboard

### 5. Register an Admin
1. Click "Sign Up" button
2. Fill the form:
   - Register As: **Admin**
   - First Name: `Jane`
   - Last Name: `Smith`
   - Email: `jane@test.com`
   - Contact: `+23276222222`
   - Address: `456 Oak Ave, Freetown`
   - Password: `admin456`
3. Click "Create Account"
4. ✅ Should see success message

### 6. Approve the Admin
1. Login as Super Admin
2. In Super Admin Dashboard, find "Pending Admins" section
3. Find Jane Smith in the list
4. Click the "Approve" button
5. ✅ User status should change to APPROVED

### 7. Test Admin Login
1. Logout
2. Click "Log In"
3. In the modal:
   - Select Role: **Admin**
   - Email: `jane@test.com`
   - Password: `admin456`
4. Click "Sign In"
5. ✅ Should redirect to Admin Dashboard

## ⚠️ Common Issues

### "Account is not approved yet"
- **Problem**: User is still PENDING
- **Solution**: Login as Super Admin and approve the user

### "Invalid credentials"
- **Problem**: Wrong email/password OR wrong role selected
- **Solution**: 
  - Double-check email and password
  - Make sure you selected the correct role dropdown

### "Email already exists"
- **Problem**: Email is already registered
- **Solution**: Use a different email or login with existing credentials

### Contact number validation error
- **Problem**: Wrong format
- **Solution**: Use format `+232` followed by 8 digits (e.g., `+23276111111`)

## 🎯 What to Test

✅ Login modal opens and closes smoothly
✅ Register modal opens and closes smoothly
✅ Switch between login and register modals
✅ Form validation works (required fields, email format, contact format)
✅ Registration creates PENDING users
✅ Super Admin can approve users
✅ Approved users can login
✅ Role-based redirection works (Customer → Customer Dashboard, etc.)
✅ Wrong role selection shows error
✅ Logout works correctly

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Super Admin Login | ⬜ | |
| Customer Registration | ⬜ | |
| Customer Approval | ⬜ | |
| Customer Login | ⬜ | |
| Admin Registration | ⬜ | |
| Admin Approval | ⬜ | |
| Admin Login | ⬜ | |
| Modal Animations | ⬜ | |
| Form Validation | ⬜ | |
| Role Mismatch Detection | ⬜ | |

Mark each test with ✅ when passed or ❌ if failed.

# Shipment Creation Issue - Troubleshooting

## Problem
Getting "Failed to create shipment" error with 401 Unauthorized

## Root Cause
The issue is that you're logged in as SUPER_ADMIN but trying to access CUSTOMER endpoints.

## Quick Fix Applied
Modified SecurityConfig to allow SUPER_ADMIN to access customer endpoints:
```java
.requestMatchers("/customer/**").hasAnyAuthority("CUSTOMER", "SUPER_ADMIN")
```

## Verification Steps

### 1. Check if you're logged in
- Press F12
- Go to Application tab
- Check Local Storage for `token`
- If no token, you need to login again

### 2. Check the request
- Press F12
- Go to Network tab
- Try to create shipment
- Click on the failed request
- Check if `Authorization: Bearer <token>` header is present

### 3. If Authorization header is missing
The auth interceptor isn't working. Need to:
- Clear browser cache completely
- Logout and login again
- Use incognito mode

### 4. If still 401 error
The token might be expired or invalid:
- Logout
- Login again
- Try creating shipment immediately

## Proper Way to Test Customer Features

1. **Register a Customer Account**:
   ```
   - Click "Sign Up"
   - Fill form with customer details
   - Role: CUSTOMER
   - Contact: +23212345678 (must match pattern)
   ```

2. **Approve the Customer** (as Super Admin):
   ```
   - Login as superadmin@bangura.com
   - Go to Super Admin Dashboard
   - Find pending customer
   - Click Approve
   ```

3. **Login as Customer**:
   ```
   - Logout
   - Login with customer credentials
   - Role: Select "Customer"
   ```

4. **Create Shipment**:
   ```
   - Now you can create shipments
   - All fields will work properly
   ```

## Current Status
- Backend: ✅ Running
- Frontend: ✅ Running
- Login: ✅ Working
- Issue: Authentication token not being sent with shipment creation request

# Login Debugging Guide

## Current Status
- ✅ Backend is running and receiving requests
- ✅ Database queries are executing
- ✅ Authentication endpoint is accessible

## Default Super Admin Credentials
```
Email: superadmin@bangura.com
Password: admin123
Role: SUPER_ADMIN (select this in the dropdown!)
```

## Common Login Issues

### 1. Wrong Role Selected
**Problem**: You select "CUSTOMER" but try to login with a SUPER_ADMIN account.

**Solution**: Make sure the role dropdown matches your account type:
- If logging in as Super Admin → Select "Super Admin"
- If logging in as Admin → Select "Admin"  
- If logging in as Customer → Select "Customer"

### 2. Wrong Email Format
**Problem**: Using username instead of email.

**Solution**: Always use the full email address:
- ✅ Correct: `superadmin@bangura.com`
- ❌ Wrong: `superadmin`

### 3. Account Not Approved
**Problem**: User exists but status is PENDING.

**Solution**: Only APPROVED users can login. Super Admin must approve new registrations.

### 4. Case Sensitivity
**Problem**: Email or password has wrong case.

**Solution**: 
- Emails are case-insensitive
- Passwords ARE case-sensitive: `admin123` ≠ `Admin123`

## Testing Steps

### Step 1: Test with Super Admin
1. Go to http://localhost:4200
2. Click "Log In"
3. Select "Super Admin" from dropdown
4. Enter email: `superadmin@bangura.com`
5. Enter password: `admin123`
6. Click "Sign In"

### Step 2: Check Browser Console
If login fails:
1. Press F12 to open Developer Tools
2. Go to "Console" tab
3. Look for error messages
4. Go to "Network" tab
5. Find the "login" request
6. Check the response

### Step 3: Verify Backend Response
The backend should return:
```json
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "id": 1,
  "email": "superadmin@bangura.com",
  "role": "SUPER_ADMIN",
  "status": "APPROVED"
}
```

## Creating Additional Users

### Option 1: Register via UI
1. Click "Sign Up" on landing page
2. Fill in the registration form
3. Login as Super Admin
4. Approve the new user
5. Logout and login with new credentials

### Option 2: Direct Database Insert
If you have database access, you can insert users directly.
**Note**: Passwords must be BCrypt hashed!

## Still Having Issues?

### Check These:
1. ✅ Is backend running on port 8080?
2. ✅ Is frontend running on port 4200?
3. ✅ Can you access http://localhost:8080/api/auth/login?
4. ✅ Are there any CORS errors in browser console?
5. ✅ Is the user's status "APPROVED" in database?

### Test Backend Directly
Open PowerShell and run:
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"superadmin@bangura.com","password":"admin123"}'
```

If this works, the backend is fine and the issue is in the frontend.

## What Email/Password Are You Using?

Please tell me:
1. What email are you trying to login with?
2. What role did you select in the dropdown?
3. What error message do you see?
4. Did you register this user or is it the default super admin?

This will help me identify the exact issue!

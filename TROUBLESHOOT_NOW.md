# Troubleshoot Modal Forms - Do This Now

## I've Added Debug Logging

The landing component now has detailed console logging. Here's what to do:

## Step-by-Step Troubleshooting

### 1. Open Browser Console
1. Go to http://localhost:4200
2. Press **F12** (or right-click → Inspect)
3. Click the **Console** tab
4. Keep it visible

### 2. Test Registration
1. Click "Sign Up" button
2. Fill in the form:
   ```
   Register As: Customer
   First Name: Test
   Last Name: User
   Email: test123@example.com
   Contact: +23276111111
   Address: 123 Test Street
   Password: test123
   ```
3. Click "Create Account"

### 3. Check Console Output

You should see:
```
🔵 Registration form submitted
📝 Register data: {firstName: "Test", lastName: "User", ...}
```

Then either:
```
✅ Registration successful: {...}
```

OR:
```
❌ Registration error: {...}
Error status: 400
Error body: {...}
```

### 4. Tell Me What You See

**Copy and paste the console output here** so I can see exactly what's happening.

## Quick Tests

### Test A: Does the standalone register page work?
1. Go to http://localhost:4200/register
2. Fill in the same data
3. Submit
4. **Does it work?** YES / NO

### Test B: Does the standalone login page work?
1. Go to http://localhost:4200/login
2. Email: superadmin@bangura.com
3. Password: admin123
4. Role: Super Admin
5. **Does it work?** YES / NO

### Test C: Check Network Tab
1. In DevTools, click **Network** tab
2. Try registration from modal again
3. Look for request to `/auth/register`
4. Click on it
5. **What's the Status Code?** (200, 400, 404, 500?)
6. **What's in the Response tab?**

## Common Scenarios

### Scenario 1: "Email already exists"
**Cause**: You already registered that email
**Fix**: Use a different email like test456@example.com

### Scenario 2: "Account is not approved yet"
**Cause**: User registered but not approved
**Fix**: 
1. Login as Super Admin
2. Go to Super Admin Dashboard
3. Approve the pending user
4. Try logging in again

### Scenario 3: "Invalid credentials"
**Cause**: Wrong email/password OR wrong role selected
**Fix**: 
- Check email and password are correct
- Make sure you selected the right role (Customer/Admin/Super Admin)

### Scenario 4: No error, but nothing happens
**Cause**: Form not submitting
**Check**: 
- Do you see the blue "🔵 Registration form submitted" in console?
- If NO: Form submission is blocked
- If YES: Check what comes after

### Scenario 5: CORS error
**Symptom**: Console shows "blocked by CORS policy"
**Fix**: Backend needs to allow localhost:4200
**Check**: AuthController should have `@CrossOrigin(origins = "http://localhost:4200")`

## What I Need From You

Please provide:

1. **Console output** when you submit the form (copy/paste)
2. **Network tab** - Status code and response
3. **Does standalone /register work?** YES/NO
4. **Does standalone /login work?** YES/NO
5. **Exact error message** you see in the alert

With this info, I can fix the exact issue!

## Quick Fix Attempts

### If forms aren't submitting at all:
The issue might be with the form element. Check if you see the console logs.

### If you get validation errors:
Make sure contact number is exactly: +232 followed by 8 digits
Example: +23276111111 (not +232 76 111 111)

### If backend returns 400:
Check the response body in Network tab - it will tell you exactly what's wrong

### If you get "Cannot connect to server":
Backend might not be running. Check if http://localhost:8080/api works.

## Test Right Now

1. Open http://localhost:4200
2. Open Console (F12)
3. Click "Sign Up"
4. Fill form with:
   - Email: test999@example.com
   - Contact: +23276999999
   - Other fields: anything
5. Click "Create Account"
6. **Copy the console output and tell me what you see!**

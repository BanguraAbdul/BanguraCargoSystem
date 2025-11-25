# Debugging Modal Forms

## Steps to Debug

### 1. Open Browser Developer Tools
1. Open http://localhost:4200
2. Press F12 to open DevTools
3. Go to the "Console" tab
4. Keep it open while testing

### 2. Test Registration
1. Click "Sign Up" button
2. Fill in the form with test data:
   - Register As: Customer
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Contact: +23276111111
   - Address: Test Address
   - Password: test123
3. Click "Create Account"
4. **Check the Console tab** for any errors
5. **Check the Network tab** for the API request

### 3. Check Network Tab
1. In DevTools, go to "Network" tab
2. Try registration again
3. Look for a request to `http://localhost:8080/api/auth/register`
4. Click on it to see:
   - Request Headers
   - Request Payload (should show your form data)
   - Response (what the server returned)
   - Status Code (200 = success, 400 = bad request, 500 = server error)

### 4. Common Issues to Check

#### Issue 1: CORS Error
**Symptom**: Console shows "CORS policy" error
**Solution**: Backend needs to allow requests from localhost:4200

Check if AuthController has:
```java
@CrossOrigin(origins = "http://localhost:4200")
```

#### Issue 2: Form Data Not Binding
**Symptom**: Request payload is empty or missing fields
**Solution**: Check ngModel bindings in HTML

Verify each input has:
```html
[(ngModel)]="registerData.fieldName"
name="fieldName"
```

#### Issue 3: Wrong API URL
**Symptom**: 404 Not Found error
**Solution**: Verify API URL in AuthService

Should be:
```typescript
private apiUrl = 'http://localhost:8080/api';
```

#### Issue 4: Backend Not Running
**Symptom**: "ERR_CONNECTION_REFUSED" or "Cannot connect to server"
**Solution**: Check if backend is running on port 8080

Test: Open http://localhost:8080/api in browser

#### Issue 5: Validation Error
**Symptom**: 400 Bad Request with validation message
**Solution**: Check the response body for specific validation errors

Common validations:
- Email format must be valid
- Contact must be +232 followed by 8 digits
- All required fields must be filled

### 5. Compare with Working Pages

#### Test the Standalone Register Page
1. Go to http://localhost:4200/register
2. Fill in the same data
3. Submit
4. Does it work?

If YES: The modal has a different issue
If NO: The backend or service has an issue

#### Test the Standalone Login Page
1. Go to http://localhost:4200/login
2. Try logging in as Super Admin:
   - Email: superadmin@bangura.com
   - Password: admin123
   - Role: Super Admin
3. Does it work?

If YES: Login service works, modal might have issue
If NO: Backend authentication has an issue

### 6. Check What Error You're Getting

Please tell me:
1. **What error message do you see?** (exact text)
2. **Where do you see it?** (alert popup, console, network tab)
3. **What's the HTTP status code?** (in Network tab)
4. **What's in the response body?** (in Network tab)

### 7. Test API Directly

Open the `test-api.html` file I created:
1. Open test-api.html in your browser
2. Click "Test Register Customer"
3. Click "Test Login Super Admin"
4. Check the results

This will tell us if the API itself is working.

### 8. Check Backend Logs

Look at the backend console output for any errors when you submit the form.

Common backend errors:
- Database connection issues
- Validation errors
- Null pointer exceptions
- Missing required fields

## What to Report

Please provide:
1. ✅ Exact error message
2. ✅ HTTP status code from Network tab
3. ✅ Request payload from Network tab
4. ✅ Response body from Network tab
5. ✅ Any console errors
6. ✅ Does standalone /register page work?
7. ✅ Does standalone /login page work?
8. ✅ Backend console output when submitting

With this information, I can pinpoint the exact issue!

## Quick Comparison Test

### Modal Form Data Structure
```typescript
registerData: RegisterRequest = {
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  address: '',
  password: '',
  role: 'CUSTOMER'
};
```

### Standalone Register Component Data Structure
```typescript
registerData: RegisterRequest = {
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  address: '',
  password: '',
  role: 'CUSTOMER'
};
```

They're identical! So the issue must be elsewhere.

## Possible Causes

1. **Form not submitting**: Check if (ngSubmit) is firing
2. **Data not binding**: Check ngModel bindings
3. **Service not called**: Check if authService.register() is called
4. **API error**: Check backend response
5. **CORS issue**: Check browser console for CORS errors
6. **Network issue**: Check if request reaches backend

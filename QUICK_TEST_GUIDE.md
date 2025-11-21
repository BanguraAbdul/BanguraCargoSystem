# 🚀 Quick Test Guide - Enhanced Create Shipment Form

## ⚡ Quick Start

1. **Open Form**: http://localhost:4200/create-shipment
2. **Login First** (if not logged in): Use customer account or register new one

## 🧪 5-Minute Test

### Test 1: Invalid Submission (30 seconds)
1. Click "Create Shipment" button immediately
2. ✅ **Expect**: Error alert + red borders on all required fields

### Test 2: Weight Limits (1 minute)
1. Enter weight = `0` → ❌ Error: "Minimum value is 0.1"
2. Enter weight = `501` → ❌ Error: "Maximum value is 500"
3. Enter weight = `2.5` → ✅ Accepted

### Test 3: Quantity Limits (1 minute)
1. Enter quantity = `0` → ❌ Error: "Minimum value is 1"
2. Enter quantity = `101` → ❌ Error: "Maximum value is 100"
3. Enter quantity = `5` → ✅ Accepted

### Test 4: Email Validation (30 seconds)
1. Enter sender email = `invalid` → ❌ Error: "Invalid email format"
2. Enter sender email = `test@example.com` → ✅ Accepted

### Test 5: Valid Submission (2 minutes)
Fill in these values:

**Sender:**
- Name: `John Doe`
- Phone: `+23276123456`
- Email: `john@example.com`

**Origin:**
- Country: `Sierra Leone`
- City: `Freetown`
- Address: `123 Main Street, Downtown Freetown`

**Recipient:**
- Name: `Jane Smith`
- Phone: `+1234567890`

**Destination:**
- Country: `United States`
- City: `New York`
- Address: `456 Park Avenue, Manhattan, NY`

**Package:**
- Product Type: `Electronics`
- Weight: `5`
- Quantity: `2`
- Description: `Two laptop computers for business use`

Click "Create Shipment"
✅ **Expect**: Success message + redirect to dashboard

## 📋 Validation Quick Reference

| Field | Min | Max | Required |
|-------|-----|-----|----------|
| Weight | 0.1 kg | 500 kg | ✅ |
| Quantity | 1 | 100 | ✅ |
| Name | 3 chars | 100 chars | ✅ |
| Address | 10 chars | 200 chars | ✅ |
| Description | 10 chars | 500 chars | ✅ |
| Phone | 10 digits | 15 digits | ✅ |
| Email | Valid format | - | ✅ (sender) |

## 🎯 What to Look For

### Visual Feedback
- ✅ Red borders on invalid fields
- ✅ Error messages below fields
- ✅ Character counters updating
- ✅ Form status indicator (right sidebar)
- ✅ Green checkmarks when sections complete

### Cost Estimation
- ✅ Updates as you type weight/quantity
- ✅ Shows in SLL currency
- ✅ Adds insurance cost if checked

### Form Status
- ✅ Shows 5 sections
- ✅ Checkmarks appear when valid
- ✅ "Ready to Submit" when all valid

## ⚠️ Common Issues to Test

1. **Empty required fields** → Should show errors
2. **Weight = 0** → Should reject
3. **Quantity = 0** → Should reject
4. **Invalid email** → Should reject
5. **Short description** (< 10 chars) → Should reject
6. **Long description** (> 500 chars) → Should reject

## ✅ Success Indicators

- Form submits without errors
- Loading indicator appears
- Success message shows
- Redirects to customer dashboard
- New shipment appears in dashboard list

## 🔗 Quick Links

- **Form**: http://localhost:4200/create-shipment
- **Dashboard**: http://localhost:4200/customer
- **Login**: http://localhost:4200/login

## 📞 Test Credentials

**Super Admin:**
- Email: `superadmin@bangura.com`
- Password: `admin123`

**Create Customer:**
1. Go to http://localhost:4200/register
2. Fill form with CUSTOMER role
3. Login as super admin to approve
4. Login as customer to test form

---

**Everything is ready for testing!** 🎉

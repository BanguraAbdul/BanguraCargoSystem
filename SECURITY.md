# Security Policy

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability in the Bangura Cargo System, please report it by:

1. **DO NOT** open a public issue
2. Email the details to: [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

## 🛡️ Security Best Practices

### For Deployment

1. **Database Security**
   - Use strong passwords
   - Enable SSL/TLS for database connections
   - Restrict database access by IP
   - Regular backups

2. **Application Security**
   - Change default super admin password
   - Use strong JWT secret (minimum 256 bits)
   - Enable HTTPS in production
   - Configure CORS properly
   - Keep dependencies updated

3. **Environment Variables**
   - Never commit sensitive data to Git
   - Use environment variables for:
     - Database credentials
     - JWT secret
     - API keys
   - Use different secrets for dev/staging/production

4. **Authentication**
   - Enforce strong password policies
   - Implement rate limiting
   - Add CAPTCHA for registration
   - Enable two-factor authentication (future)

5. **API Security**
   - Validate all inputs
   - Sanitize user data
   - Use parameterized queries (already implemented)
   - Implement request throttling

## ⚠️ Known Security Considerations

### Default Credentials
- Default super admin credentials are provided for initial setup
- **MUST** be changed immediately in production
- Consider removing auto-creation in production builds

### JWT Token
- Tokens expire after 24 hours
- Stored in localStorage (consider httpOnly cookies for production)
- Secret key must be changed from default

### CORS Configuration
- Currently allows localhost:4200
- Update for production domain
- Restrict to specific origins

### Database
- Default PostgreSQL credentials in example file
- Use strong passwords in production
- Enable SSL connections

## 🔐 Security Features Implemented

✅ Password encryption with BCrypt  
✅ JWT-based authentication  
✅ Role-based authorization  
✅ SQL injection prevention (JPA/Hibernate)  
✅ XSS protection (Angular sanitization)  
✅ CSRF protection (disabled for API, enable if needed)  
✅ Input validation (backend and frontend)  

## 📋 Security Checklist for Production

- [ ] Change default super admin password
- [ ] Generate new JWT secret (256+ bits)
- [ ] Enable HTTPS
- [ ] Configure production CORS
- [ ] Use environment variables for secrets
- [ ] Enable database SSL
- [ ] Set up firewall rules
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring and alerts
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Implement backup strategy
- [ ] Add CAPTCHA to registration
- [ ] Enable audit logging

## 🔄 Security Updates

We regularly update dependencies to patch security vulnerabilities. 

### How to Update

**Backend:**
```bash
cd backend
.\gradlew.bat dependencyUpdates
```

**Frontend:**
```bash
cd frontend
npm audit
npm audit fix
```

## 📞 Contact

For security concerns, contact: [your-email@example.com]

## 🙏 Responsible Disclosure

We appreciate security researchers who responsibly disclose vulnerabilities. We commit to:

- Acknowledge receipt within 48 hours
- Provide regular updates on progress
- Credit researchers (if desired) after fix is deployed
- Work collaboratively to resolve issues

Thank you for helping keep Bangura Cargo System secure!

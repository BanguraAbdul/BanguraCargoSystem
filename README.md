# 🚚 Bangura Cargo System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-20.3.10-red.svg)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12%2B-blue.svg)](https://www.postgresql.org/)
[![Gradle](https://img.shields.io/badge/Gradle-9.1.0-blue.svg)](https://gradle.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive cargo management system built with Spring Boot and Angular, featuring role-based access control, shipment tracking, and a professional FedEx-inspired UI.

![Bangura Cargo System](https://img.shields.io/badge/Status-Production%20Ready-success)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Features

### For Customers
- ✅ Create and track shipments
- ✅ Calculate shipping rates
- ✅ Schedule pickups
- ✅ Manage returns
- ✅ View international shipping guide
- ✅ Real-time shipment status updates

### For Admins
- ✅ Approve customer registrations
- ✅ Manage all shipments
- ✅ Update shipment statuses
- ✅ View system statistics
- ✅ User management

### For Super Admins
- ✅ Approve admin registrations
- ✅ Full user management
- ✅ System-wide oversight
- ✅ Delete users and shipments

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.5
- **Build Tool**: Gradle 9.1.0
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Language**: Java 17+

### Frontend
- **Framework**: Angular 20.3.10
- **UI Library**: Bootstrap 5
- **Icons**: Font Awesome + Bootstrap Icons
- **Alerts**: SweetAlert2
- **HTTP Client**: Angular HttpClient
- **Language**: TypeScript

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java**: JDK 17 or higher
- **Node.js**: 18 or higher
- **PostgreSQL**: 12 or higher
- **npm**: 9 or higher
- **Git**: Latest version

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/bangura-cargo-system.git
cd bangura-cargo-system
```

### 2. Database Setup

```sql
-- Create database
CREATE DATABASE bangura_cargo_db;

-- Create user (optional)
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bangura_cargo_db TO postgres;
```

### 3. Backend Configuration

```bash
cd backend
```

Copy the example configuration file:
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Edit `application.properties` and update:
```properties
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
jwt.secret=YOUR_SECRET_KEY_HERE
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/bangura_cargo_db
spring.datasource.username=postgres
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your_secret_key_min_256_bits
jwt.expiration=86400000

# Server Configuration
server.port=8080
server.servlet.context-path=/api
```

### Frontend Configuration

If your backend runs on a different port, update the API URL in:
- `frontend/src/app/services/*.service.ts`

```typescript
private apiUrl = 'http://localhost:8080/api';
```

## 🏃 Running the Application

### Start Backend

```bash
cd backend

# Windows
.\gradlew.bat bootRun

# Unix/Mac
./gradlew bootRun
```

Backend will start on: **http://localhost:8080**

### Start Frontend

```bash
cd frontend
npm start
```

Frontend will start on: **http://localhost:4200**

## 🔐 Default Credentials

### Super Admin (Auto-created on first run)
- **Email**: superadmin@bangura.com
- **Password**: admin123

⚠️ **Important**: Change the default password in production!

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
```

### Customer Endpoints

```
GET  /api/customer/shipments           - Get customer's shipments
POST /api/customer/shipments           - Create new shipment
```

### Admin Endpoints

```
GET  /api/admin/users                      - Get all users
GET  /api/admin/users/pending-customers    - Get pending customers
POST /api/admin/users/{id}/approve         - Approve customer
GET  /api/admin/shipments                  - Get all shipments
PUT  /api/admin/shipments/{id}/status      - Update shipment status
```

### Super Admin Endpoints

```
GET  /api/super-admin/users                    - Get all users
GET  /api/super-admin/users/pending-admins     - Get pending admins
POST /api/super-admin/users/{id}/approve       - Approve admin
```

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 📁 Project Structure

```
bangura-cargo-system/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/       # Java source files
│   │       └── resources/  # Configuration files
│   └── build.gradle        # Gradle configuration
├── frontend/               # Angular application
│   ├── src/
│   │   └── app/
│   │       ├── components/ # UI components
│   │       ├── services/   # API services
│   │       ├── guards/     # Route guards
│   │       └── models/     # Data models
│   └── package.json        # npm dependencies
└── README.md              # This file
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
.\gradlew.bat test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `application.properties`
- Ensure database exists

### Port Already in Use
- Backend: Change `server.port` in `application.properties`
- Frontend: Use `ng serve --port 4201`

### JWT Token Expired
- Logout and login again
- Token expires after 24 hours by default

## 📖 Additional Documentation

- [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Feature completion status
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Comprehensive testing instructions
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed architecture
- [DATABASE_MANAGEMENT.md](DATABASE_MANAGEMENT.md) - Database operations
- [MODELS_DOCUMENTATION.md](MODELS_DOCUMENTATION.md) - Data models reference

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Java naming conventions for backend
- Follow Angular style guide for frontend
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Bangura Cargo Team**

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Angular team for the powerful frontend framework
- Bootstrap team for the UI components
- All contributors and testers

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check existing documentation
- Review the troubleshooting section

## 🔄 Version History

- **v1.0.0** (2025-11-20)
  - Initial release
  - Complete CRUD operations
  - Role-based access control
  - Professional UI/UX
  - Comprehensive documentation

## 🚀 Deployment

### Production Considerations

1. **Security**
   - Change default passwords
   - Use strong JWT secret
   - Enable HTTPS
   - Configure CORS properly

2. **Database**
   - Use production database
   - Enable connection pooling
   - Set up regular backups

3. **Environment Variables**
   - Use environment variables for sensitive data
   - Never commit credentials to Git

4. **Performance**
   - Enable caching
   - Optimize database queries
   - Use CDN for static assets

## 📊 Screenshots

### Landing Page
Professional FedEx-inspired design with hero section and service cards.

### Customer Dashboard
Track shipments, create new shipments, and view statistics.

### Admin Dashboard
Manage users, approve customers, and update shipment statuses.

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Real-time tracking with WebSockets
- [ ] Payment gateway integration
- [ ] Document upload for customs
- [ ] Multi-language support
- [ ] Mobile application
- [ ] Analytics dashboard
- [ ] PDF report generation

---

**Built with ❤️ for efficient cargo management**

⭐ Star this repository if you find it helpful!

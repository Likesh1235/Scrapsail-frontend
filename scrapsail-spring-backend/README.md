# ScrapSail Backend - Spring Boot API

Smart Waste & Carbon Credit Management System Backend

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Gmail account with App Password

### 1. Database Setup
```sql
CREATE DATABASE scrapsail_db;
```

### 2. Environment Variables
```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

### 3. Run Application
```bash
mvn clean install
mvn spring-boot:run
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Pickup Management
- `POST /api/pickup/send-otp` - Send OTP to email
- `POST /api/pickup/verify-otp?userId={id}` - Verify OTP and create pickup
- `GET /api/pickup/pending` - Get pending pickups (Admin)
- `PUT /api/pickup/assign` - Assign collector to pickup
- `PUT /api/pickup/update-status` - Update pickup status
- `GET /api/pickup/collector/{id}` - Get collector's pickups
- `GET /api/pickup/user/{id}` - Get user's pickups

### Wallet Management
- `GET /api/wallet/{userId}` - Get user's carbon wallet
- `POST /api/wallet/create/{userId}` - Create new wallet

## 🔧 Configuration

### Database
- Host: localhost:3306
- Database: scrapsail_db
- Username: root
- Password: (your MySQL password)

### Email Service
- SMTP: smtp.gmail.com:587
- Authentication: Gmail App Password required

## 🏗️ Architecture

- **Entities**: User, PickupRequest, CarbonWallet
- **Repositories**: JPA repositories for data access
- **Services**: Business logic layer
- **Controllers**: REST API endpoints
- **Security**: BCrypt password encoding, CORS enabled

## 📊 Database Schema

Tables are created automatically by Hibernate JPA:
- `users` - User accounts (USER, ADMIN, COLLECTOR roles)
- `pickup_requests` - Waste pickup requests
- `carbon_wallets` - Carbon credit wallets

## 🔐 Security Features

- Password encryption with BCrypt
- CORS enabled for frontend integration
- Role-based access control
- OTP verification for pickup requests

## 📧 Gmail OTP Setup

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password
3. Set environment variables:
   - `MAIL_USERNAME`: your Gmail address
   - `MAIL_PASSWORD`: your App Password

## 🚀 Deployment

The application runs on port 8080 by default.
Frontend should connect to: `http://localhost:8080/api/`


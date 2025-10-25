# 🚀 ScrapSail - Smart Waste Management Platform

A comprehensive waste management platform with OTP verification, Razorpay integration, and carbon credit system.

## 📁 Project Structure

```
scrapsail-frontend-new/
├── src/                          # React Frontend
│   ├── components/               # Reusable components
│   ├── pages/                    # Page components
│   └── ...
├── scrapsail-backend/            # Node.js Backend
│   ├── controllers/              # API controllers
│   ├── services/                 # Business logic
│   ├── models/                   # Data models
│   ├── routes/                   # API routes
│   ├── config/                   # Configuration files
│   ├── migrations/               # Database migrations
│   ├── otp-server.js             # OTP verification server
│   ├── send-otp-to-user.js       # OTP sending utility
│   ├── send-otp-batch.js         # Batch OTP sending
│   ├── send-otp-interactive.js   # Interactive OTP sender
│   └── package.json              # Node.js dependencies
├── scrapsail-spring-backend/     # Spring Boot Backend
│   ├── src/main/java/com/scrapsail/
│   │   ├── controller/           # REST controllers
│   │   ├── service/              # Business services
│   │   ├── model/                 # Data models
│   │   └── repository/           # Data repositories
│   └── src/main/resources/
│       └── application.properties # Spring configuration
└── README.md                     # This file
```

## 🚀 Quick Start

### 1. Start OTP Server (Required for email verification)
```bash
cd scrapsail-backend
node otp-server.js
```

### 2. Start Spring Boot Backend
```bash
cd scrapsail-spring-backend
mvn spring-boot:run
```

### 3. Start React Frontend
```bash
npm start
```

## 📧 OTP Verification System

### Send OTP to any user:
```bash
node send-otp-to-user.js user@example.com
```

### Send OTPs to multiple users:
```bash
node send-otp-batch.js
```

### Interactive OTP sending:
```bash
node send-otp-interactive.js
```

## 🔧 Configuration

### Email Configuration
- **Sender**: ScrapSail <likeshkanna74@gmail.com>
- **SMTP**: smtp.gmail.com:587
- **App Password**: rvoueevkbdwtiizl

### Database Configuration
- **MySQL**: localhost:3306
- **Database**: scrapsail
- **User**: root (no password)

## 🧪 Testing

### Test OTP Server:
```bash
curl http://localhost:8080/health
```

### Send Test OTP:
```bash
curl -X POST "http://localhost:8080/api/otp/send?email=test@example.com"
```

### Verify OTP:
```bash
curl -X POST "http://localhost:8080/api/otp/verify?email=test@example.com&otp=123456"
```

## 📱 Features

- ✅ **OTP Verification**: Email-based verification system
- ✅ **Razorpay Integration**: Payment processing
- ✅ **Carbon Wallet**: Points and rewards system
- ✅ **Pickup Management**: Request and track pickups
- ✅ **Admin Dashboard**: Manage requests and users
- ✅ **Collector Dashboard**: Handle pickup assignments
- ✅ **Professional Email Templates**: ScrapSail branding

## 🛠️ Technologies Used

### Frontend
- React.js
- Framer Motion
- Tailwind CSS

### Backend
- Node.js + Express
- Spring Boot
- MySQL
- Nodemailer (SMTP)

### Payment
- Razorpay API

### Email
- Gmail SMTP
- Professional HTML templates

## 📞 Support

For any issues or questions, please check the configuration files and ensure all services are running properly.

---

**ScrapSail** - Making recycling rewarding! 🌱♻️
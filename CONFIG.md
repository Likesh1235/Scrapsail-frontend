# ScrapSail Project Configuration

## 🚀 Quick Start Commands

### Start All Services
```bash
npm run start-all
```

### Start Individual Services
```bash
# OTP Server only
npm run otp-server

# Spring Boot Backend only
npm run spring-boot

# React Frontend only
npm start
```

### OTP Testing Commands
```bash
# Send OTP to single user
npm run send-otp user@example.com

# Send OTPs to multiple users
npm run send-otp-batch
```

## 📧 Email Configuration

- **Sender**: ScrapSail <likeshkanna74@gmail.com>
- **App Password**: rvoueevkbdwtiizl
- **SMTP**: smtp.gmail.com:587

## 🗄️ Database Configuration

- **Host**: localhost:3306
- **Database**: scrapsail
- **User**: root
- **Password**: (none)

## 🌐 Service URLs

- **OTP Server**: http://localhost:8080
- **Spring Boot**: http://localhost:8080 (if different port)
- **React App**: http://localhost:3000

## 🧪 Testing Endpoints

### OTP Server
- Health Check: `GET http://localhost:8080/health`
- Send OTP: `POST http://localhost:8080/api/otp/send?email=user@example.com`
- Verify OTP: `POST http://localhost:8080/api/otp/verify?email=user@example.com&otp=123456`

### Spring Boot (when running)
- All endpoints available at: `http://localhost:8080/api/`

## 📁 Clean Project Structure

```
scrapsail-frontend-new/
├── src/                          # React Frontend
├── scrapsail-backend/            # Node.js Backend + OTP Server
├── scrapsail-spring-backend/     # Spring Boot Backend
├── start-project.js              # Startup script
├── package.json                  # NPM scripts
└── README.md                     # Documentation
```

## 🔧 Troubleshooting

1. **OTP Server not starting**: Check if port 8080 is available
2. **Email not sending**: Verify Gmail app password is correct
3. **Spring Boot errors**: Check database connection and compilation
4. **React not loading**: Ensure all dependencies are installed

---

**Ready to start?** Run `npm run start-all` to launch everything! 🚀



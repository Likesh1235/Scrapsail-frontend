# 🚀 ScrapSail Complete Setup Guide

## ✅ What's Been Completed

### Frontend (React + Tailwind CSS)
- ✅ All ESLint errors fixed
- ✅ Modern UI with Tailwind CSS
- ✅ Role-based login (User, Admin, Collector)
- ✅ Complete pickup workflow UI
- ✅ Admin dashboard with pickup management
- ✅ Collector dashboard with assigned pickups
- ✅ OTP verification for pickup requests
- ✅ Carbon wallet functionality

### Backend (Node.js + MySQL)
- ✅ Converted from MongoDB to MySQL
- ✅ Email whitelist system for admin/collector roles
- ✅ Complete API endpoints for all workflows
- ✅ OTP service with email integration
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Database setup script

## 🛠️ Setup Instructions

### 1. Frontend Setup
```bash
# Navigate to frontend directory
cd scrapsail-frontend-new

# Install dependencies (if not already done)
npm install

# Start frontend
npm start
```

### 2. Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd scrapsail-backend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Setup MySQL Database
```bash
# Run the interactive setup script
npm run setup
```

This script will:
- Ask for your MySQL credentials
- Create the database
- Create all necessary tables
- Optionally create sample admin/collector users
- Update your .env file

#### Step 4: Start Backend Server
```bash
npm run dev
```

## 🔧 Manual Database Setup (Alternative)

If you prefer to set up MySQL manually:

### 1. Create Database
```sql
CREATE DATABASE scrapsail;
```

### 2. Update .env File
```env
# Server Configuration
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=scrapsail

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Add Admin/Collector Emails to Whitelist
```sql
-- Add admin email
INSERT INTO email_whitelist (email, role) VALUES ('admin@yourcompany.com', 'admin');

-- Add collector email
INSERT INTO email_whitelist (email, role) VALUES ('collector@yourcompany.com', 'collector');
```

## 📧 Email Configuration (Optional)

To enable email OTP functionality:

1. **Gmail Setup:**
   - Enable 2-factor authentication
   - Generate an App Password
   - Update `.env` file with your Gmail credentials

2. **Test Email:**
   ```bash
   # Test OTP sending
   curl -X POST http://localhost:8080/api/otp/send \
     -H "Content-Type: application/json" \
     -d '{"email":"test@gmail.com","type":"pickup"}'
   ```

## 🎯 Key Features Implemented

### Email Whitelist System
- Only whitelisted emails can register as admin/collector
- Regular users can register without whitelist
- Easy to add/remove emails from whitelist

### Complete Pickup Workflow
1. **User** submits pickup request with OTP verification
2. **Admin** reviews and approves/rejects requests
3. **Admin** assigns approved requests to collectors
4. **Collector** accepts assigned requests
5. **Collector** starts and completes pickups
6. **System** automatically awards carbon credits

### Role-Based Access
- **Users**: Submit pickup requests, view wallet, redeem credits
- **Collectors**: View assigned pickups, manage routes, track earnings
- **Admins**: Manage all users, approve pickups, view analytics

## 🚨 Troubleshooting

### MySQL Connection Issues
```bash
# Check if MySQL is running
mysql -u root -p

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

### Port Conflicts
```bash
# Check what's running on port 8080
netstat -ano | findstr :8080

# Kill process if needed
taskkill /PID <process_id> /F
```

### Frontend Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📱 Testing the Application

### 1. Register Users
- Regular users can register normally
- Admin/Collector emails must be whitelisted first

### 2. Test Pickup Workflow
1. Login as user
2. Submit pickup request (OTP verification required)
3. Login as admin to approve/assign
4. Login as collector to accept/complete

### 3. Test API Endpoints
```bash
# Health check
curl http://localhost:8080/api/health

# Get pending pickups (admin only)
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:8080/api/pickup/admin/pending
```

## 🎉 Success!

Your ScrapSail application is now fully set up with:
- ✅ MySQL database
- ✅ Email whitelist system
- ✅ Complete pickup workflow
- ✅ Role-based authentication
- ✅ Modern React UI
- ✅ OTP verification
- ✅ Carbon credit system

The application is ready for production use!


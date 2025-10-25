# 🧩 Complete OTP Verification Flow Setup Guide

## 📋 Overview

This guide implements the complete OTP verification flow for ScrapSail pickup requests:

1. **Send OTP** → User requests pickup
2. **Verify OTP** → User enters OTP from email
3. **Submit Pickup** → Only after OTP verification
4. **Admin Management** → View and manage requests

## 🏗️ Backend Structure

```
src/main/java/com/scrapsail/
├── controller/
│   ├── OtpController.java      ✅ OTP send/verify
│   └── PickupController.java   ✅ Pickup CRUD with OTP check
├── service/
│   └── EmailService.java       ✅ Email sending with OTP
├── model/
│   └── PickupRequest.java     ✅ Pickup data model
└── repository/
    └── PickupRepository.java  ✅ Data access layer
```

## 🔧 Configuration

### 1. Email Configuration (application.properties)
```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=likeshkanna74@gmail.com
spring.mail.password=rvoueevkbdwtiizl
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 2. Database Configuration
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/scrapsail
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## 🚀 API Endpoints

### OTP Endpoints
```bash
# Send OTP
POST /api/otp/send?email=user@gmail.com
Response: {"success": true, "message": "OTP sent to user@gmail.com", "otp": "123456"}

# Verify OTP
POST /api/otp/verify?email=user@gmail.com&otp=123456
Response: {"success": true, "message": "OTP verified successfully!"}

# Check verification status
GET /api/otp/status?email=user@gmail.com
Response: {"email": "user@gmail.com", "verified": true, "hasOtp": false}
```

### Pickup Endpoints
```bash
# Submit pickup request (requires OTP verification)
POST /api/pickup/request
Content-Type: application/json
{
  "name": "Likesh Kanna",
  "email": "likeshkanna74@gmail.com",
  "phone": "9876543210",
  "scrapType": "Plastic, Metal",
  "pickupDate": "2025-10-24",
  "address": "Dharmapuri, Tamil Nadu",
  "latitude": 12.1223,
  "longitude": 78.2345
}

# Get all pickup requests
GET /api/pickup/requests

# Get pickup by ID
GET /api/pickup/requests/{id}

# Update pickup status
PUT /api/pickup/requests/{id}/status?status=APPROVED&notes=Approved by admin

# Get pickup statistics
GET /api/pickup/stats
```

## 🧪 Testing the Flow

### 1. Start Spring Boot Backend
```bash
cd scrapsail-spring-backend
mvn spring-boot:run
```

### 2. Run Complete Flow Test
```bash
node test-otp-flow.js
```

### 3. Manual Testing
```bash
# Step 1: Send OTP
curl -X POST "http://localhost:8080/api/otp/send?email=likeshkanna74@gmail.com"

# Step 2: Verify OTP (use OTP from email)
curl -X POST "http://localhost:8080/api/otp/verify?email=likeshkanna74@gmail.com&otp=123456"

# Step 3: Submit pickup request
curl -X POST http://localhost:8080/api/pickup/request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Likesh Kanna",
    "email": "likeshkanna74@gmail.com",
    "phone": "9876543210",
    "scrapType": "Plastic, Metal",
    "pickupDate": "2025-10-24",
    "address": "Dharmapuri, Tamil Nadu",
    "latitude": 12.1223,
    "longitude": 78.2345
  }'
```

## 🔒 Security Features

### OTP Verification Flow
1. **OTP Generation**: 6-digit random number
2. **Email Delivery**: Sent to user's email
3. **Verification Check**: Required before pickup submission
4. **Auto Cleanup**: OTP removed after verification
5. **Status Tracking**: Verification status stored in memory

### Data Validation
- ✅ Required field validation
- ✅ Email format validation
- ✅ OTP verification mandatory
- ✅ Status update with notes
- ✅ Error handling and logging

## 📊 Database Schema

### PickupRequest Table
```sql
CREATE TABLE pickup_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    scrap_type VARCHAR(255) NOT NULL,
    pickup_date VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    admin_notes TEXT,
    collector_notes TEXT
);
```

## 🎯 Frontend Integration

### React Frontend Flow
```javascript
// 1. Send OTP
const sendOtp = async (email) => {
  const response = await fetch(`/api/otp/send?email=${email}`, {
    method: 'POST'
  });
  return response.json();
};

// 2. Verify OTP
const verifyOtp = async (email, otp) => {
  const response = await fetch(`/api/otp/verify?email=${email}&otp=${otp}`, {
    method: 'POST'
  });
  return response.json();
};

// 3. Submit Pickup (only after OTP verification)
const submitPickup = async (pickupData) => {
  const response = await fetch('/api/pickup/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pickupData)
  });
  return response.json();
};
```

## 🚨 Error Handling

### Common Error Scenarios
1. **Email not verified**: "Please verify your email with OTP before submitting pickup request!"
2. **Invalid OTP**: "Invalid OTP!"
3. **Missing fields**: "Name is required!"
4. **Email service down**: "Failed to send OTP email"

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## 📈 Monitoring & Logs

### Console Logs
- ✅ OTP sent successfully to email: 123456
- ✅ Pickup request submitted successfully!
- ❌ Failed to send OTP email: [error details]

### Status Tracking
- **PENDING**: New request awaiting admin review
- **APPROVED**: Admin approved, ready for collection
- **REJECTED**: Admin rejected with notes
- **COMPLETED**: Collection completed

## 🎉 Success Indicators

You'll know it's working when:
- ✅ OTP emails arrive at likeshkanna74@gmail.com
- ✅ Pickup requests require OTP verification
- ✅ Admin can view and manage requests
- ✅ Status updates work correctly
- ✅ Statistics are accurate

## 🔄 Next Steps

1. **Admin Dashboard**: View and manage pickup requests
2. **Collector Assignment**: Assign approved requests to collectors
3. **Real-time Updates**: WebSocket for live status updates
4. **Email Notifications**: Send updates to users
5. **Mobile App**: React Native app for collectors

---

**Ready to test?** Start your Spring Boot backend and run the test script!





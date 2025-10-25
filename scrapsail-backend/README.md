# ScrapSail Backend API

A comprehensive backend API for the ScrapSail waste management platform, built with Node.js, Express, and MongoDB.

## Features

- **Role-based Authentication** (User, Admin, Collector)
- **JWT Token Authentication**
- **Email OTP Verification**
- **Pickup Request Management**
- **Carbon Credit System**
- **Wallet Management**
- **Admin Dashboard**
- **Collector Dashboard**
- **Analytics & Reporting**

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scrapsail-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/scrapsail
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   CARBON_CREDIT_RATE=1
   REDEMPTION_RATE=1
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Pickup Management
- `POST /api/pickup` - Create pickup request (User)
- `GET /api/pickup` - Get user's pickups (User)
- `GET /api/pickup/:id` - Get specific pickup
- `PUT /api/pickup/:id/status` - Update pickup status (Collector/Admin)
- `PUT /api/pickup/:id/assign` - Assign pickup to collector (Admin)
- `GET /api/pickup/collector/assigned` - Get assigned pickups (Collector)
- `GET /api/pickup/admin/all` - Get all pickups (Admin)

### Wallet Management
- `GET /api/wallet/:userId` - Get wallet info
- `GET /api/wallet/:userId/transactions` - Get transaction history
- `POST /api/wallet/:userId/redeem` - Redeem carbon credits (User)
- `POST /api/wallet/:userId/add-credits` - Add credits (Admin)
- `GET /api/wallet/admin/stats` - Get wallet statistics (Admin)

### Admin Dashboard
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/collectors` - Get all collectors
- `GET /api/admin/analytics` - Get analytics data

### Collector Dashboard
- `GET /api/collector/dashboard` - Get collector dashboard data
- `GET /api/collector/pickups` - Get assigned pickups
- `PUT /api/collector/pickups/:id/start` - Start pickup
- `PUT /api/collector/pickups/:id/complete` - Complete pickup
- `GET /api/collector/route` - Get optimized route
- `GET /api/collector/earnings` - Get earnings data

## Database Models

### User
- `name` - User's full name
- `email` - Email address (unique)
- `password` - Hashed password
- `role` - User role (user/admin/collector)
- `phone` - Phone number
- `address` - Address object
- `isActive` - Account status
- `emailVerified` - Email verification status
- `carbonCredits` - Total carbon credits
- `totalRecycled` - Total waste recycled (kg)
- `joinDate` - Registration date
- `lastLogin` - Last login timestamp

### Pickup
- `user` - Reference to User
- `wasteCategory` - Type of waste
- `weight` - Weight in kg
- `pickupAddress` - Pickup location
- `coordinates` - GPS coordinates
- `scheduledDate` - Scheduled pickup date
- `status` - Pickup status
- `assignedCollector` - Reference to Collector
- `carbonCreditsEarned` - Credits earned
- `notes` - Additional notes
- `images` - Pickup images
- `completionDate` - Completion timestamp
- `rating` - User rating
- `feedback` - User feedback

### Transaction
- `user` - Reference to User
- `type` - Transaction type
- `amount` - Transaction amount
- `description` - Transaction description
- `pickup` - Reference to Pickup (if applicable)
- `status` - Transaction status
- `metadata` - Additional data
- `balanceAfter` - Balance after transaction

### OTP
- `email` - Email address
- `otp` - OTP code
- `purpose` - OTP purpose
- `expiresAt` - Expiration time
- `isUsed` - Usage status
- `attempts` - Verification attempts

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-based Access Control

- **User**: Can create pickup requests, view wallet, redeem credits
- **Collector**: Can view assigned pickups, update pickup status, view earnings
- **Admin**: Full access to all endpoints, user management, analytics

## Carbon Credit System

- Users earn carbon credits for recycling waste
- Different waste types have different credit rates:
  - Plastic: 10 credits/kg
  - Metal: 15 credits/kg
  - Paper: 8 credits/kg
  - E-waste: 25 credits/kg
  - Organic: 5 credits/kg
  - Mixed: 12 credits/kg
- Credits can be redeemed for cash (1 credit = ₹1)

## Error Handling

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {} // Optional data
}
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

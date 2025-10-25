const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, initializeDatabase } = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const pickupRoutes = require('./routes/pickup');
const walletRoutes = require('./routes/wallet');
const adminRoutes = require('./routes/admin');
const collectorRoutes = require('./routes/collector');
const otpRoutes = require('./routes/otp');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection and initialization
const startServer = async () => {
  try {
    // Test MySQL connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to MySQL database');
      process.exit(1);
    }

    // Initialize database tables
    await initializeDatabase();

    // Start server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 ScrapSail Backend Server running on port ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🗄️  Database: MySQL (${process.env.DB_HOST || 'localhost'}:${process.env.DB_NAME || 'scrapsail'})`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pickup', pickupRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collector', collectorRoutes);
app.use('/api/otp', otpRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ScrapSail Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start the server
startServer();

module.exports = app;

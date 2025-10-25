const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'scrapsail',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'collector', 'admin') DEFAULT 'user',
        phone VARCHAR(20),
        address TEXT,
        carbonCredits INT DEFAULT 0,
        totalRecycled DECIMAL(10,2) DEFAULT 0,
        accountStatus ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        isVerified BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create pickups table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pickups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        wasteCategory ENUM('Plastic', 'Metal', 'Paper', 'E-waste', 'Organic', 'Mixed') NOT NULL,
        weight DECIMAL(10,2) NOT NULL,
        pickupAddress TEXT NOT NULL,
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        scheduledDate DATETIME NOT NULL,
        status ENUM('pending', 'admin-approved', 'admin-rejected', 'collector-assigned', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
        assignedCollectorId INT,
        carbonCreditsEarned INT DEFAULT 0,
        adminNotes TEXT,
        collectorNotes TEXT,
        completionDate DATETIME,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (assignedCollectorId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create transactions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        type ENUM('credit', 'debit', 'redemption') NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        relatedPickupId INT,
        balanceAfter DECIMAL(10,2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (relatedPickupId) REFERENCES pickups(id) ON DELETE SET NULL
      )
    `);

    // Create otps table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        type VARCHAR(50) DEFAULT 'pickup',
        expiresAt TIMESTAMP NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email_otp (email, otp),
        INDEX idx_expires (expiresAt)
      )
    `);

    // Create email whitelist table for admin and collector roles
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS email_whitelist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('admin', 'collector') NOT NULL,
        isActive BOOLEAN DEFAULT true,
        addedBy INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (addedBy) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_email_role (email, role),
        INDEX idx_active (isActive)
      )
    `);

    console.log('✅ Database tables created successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};

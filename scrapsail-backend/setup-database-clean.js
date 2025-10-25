#!/usr/bin/env node

/**
 * ScrapSail Database Setup Script
 * Creates database and tables
 */

const mysql = require('mysql2/promise');

async function setupDatabase() {
  console.log('🗄️ Setting up ScrapSail Database...\n');

  try {
    // Connect to MySQL server (without database)
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // No password
    });

    console.log('✅ Connected to MySQL server');

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS scrapsail');
    console.log('✅ Database "scrapsail" created');

    // Use the database
    await connection.execute('USE scrapsail');
    console.log('✅ Using scrapsail database');

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
        razorpayCustomerId VARCHAR(255),
        razorpayFundAccountId VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

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
    console.log('✅ Pickups table created');

    // Create transactions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        type ENUM('credit', 'debit', 'redemption', 'withdrawal') NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        relatedPickupId INT,
        balanceAfter DECIMAL(10,2),
        razorpayTransactionId VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (relatedPickupId) REFERENCES pickups(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Transactions table created');

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
    console.log('✅ OTPs table created');

    // Create email_whitelist table
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
    console.log('✅ Email whitelist table created');

    // Insert sample admin user
    await connection.execute(`
      INSERT IGNORE INTO users (name, email, password, role, carbonCredits, isVerified) 
      VALUES ('Admin User', 'admin@scrapsail.com', '$2b$10$example', 'admin', 1000, true)
    `);
    console.log('✅ Sample admin user created');

    // Insert sample collector
    await connection.execute(`
      INSERT IGNORE INTO users (name, email, password, role, carbonCredits, isVerified) 
      VALUES ('Collector User', 'collector@scrapsail.com', '$2b$10$example', 'collector', 500, true)
    `);
    console.log('✅ Sample collector user created');

    await connection.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Database Summary:');
    console.log('   Database: scrapsail');
    console.log('   Tables: users, pickups, transactions, otps, email_whitelist');
    console.log('   Sample users: admin@scrapsail.com, collector@scrapsail.com');
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Start your OTP server: npm run otp-server');
    console.log('   2. Start Spring Boot: npm run spring-boot');
    console.log('   3. Start React frontend: npm start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure MySQL server is running');
    console.log('   2. Check if root user has no password');
    console.log('   3. Try using XAMPP or MySQL Workbench');
  }
}

// Run the setup
setupDatabase();



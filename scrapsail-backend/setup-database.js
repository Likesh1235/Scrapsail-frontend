#!/usr/bin/env node

const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupDatabase() {
  console.log('🔧 ScrapSail MySQL Database Setup');
  console.log('=====================================\n');

  try {
    // Get database configuration
    const host = await question('MySQL Host (default: localhost): ') || 'localhost';
    const user = await question('MySQL Username (default: root): ') || 'root';
    const password = await question('MySQL Password: ');
    const database = await question('Database Name (default: scrapsail): ') || 'scrapsail';

    console.log('\n🔄 Testing MySQL connection...');

    // Test connection
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      multipleStatements: true
    });

    console.log('✅ MySQL connection successful!');

    // Create database if it doesn't exist
    console.log('🔄 Creating database...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    console.log(`✅ Database '${database}' created/verified`);

    // Use the database
    await connection.execute(`USE \`${database}\``);

    // Create tables
    console.log('🔄 Creating tables...');

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
        status ENUM('pending', 'admin-approved', 'admin-rejected', 'collector-assigned', 'collector-accepted', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
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
        metadata JSON,
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

    // Create email whitelist table
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

    console.log('✅ All tables created successfully!');

    // Create sample admin user
    const createAdmin = await question('\nCreate sample admin user? (y/n): ');
    if (createAdmin.toLowerCase() === 'y') {
      const adminEmail = await question('Admin email: ');
      const adminPassword = await question('Admin password: ');
      const adminName = await question('Admin name (default: Admin): ') || 'Admin';

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await connection.execute(
        'INSERT INTO users (name, email, password, role, accountStatus, isVerified) VALUES (?, ?, ?, ?, ?, ?)',
        [adminName, adminEmail, hashedPassword, 'admin', 'active', true]
      );

      // Add admin email to whitelist
      await connection.execute(
        'INSERT INTO email_whitelist (email, role) VALUES (?, ?)',
        [adminEmail, 'admin']
      );

      console.log('✅ Admin user created successfully!');
    }

    // Create sample collector
    const createCollector = await question('\nCreate sample collector user? (y/n): ');
    if (createCollector.toLowerCase() === 'y') {
      const collectorEmail = await question('Collector email: ');
      const collectorPassword = await question('Collector password: ');
      const collectorName = await question('Collector name (default: Collector): ') || 'Collector';

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(collectorPassword, 12);

      await connection.execute(
        'INSERT INTO users (name, email, password, role, accountStatus, isVerified) VALUES (?, ?, ?, ?, ?, ?)',
        [collectorName, collectorEmail, hashedPassword, 'collector', 'active', true]
      );

      // Add collector email to whitelist
      await connection.execute(
        'INSERT INTO email_whitelist (email, role) VALUES (?, ?)',
        [collectorEmail, 'collector']
      );

      console.log('✅ Collector user created successfully!');
    }

    await connection.end();

    // Update .env file
    console.log('\n🔄 Updating .env file...');
    const fs = require('fs');
    const envContent = `# Server Configuration
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration (MySQL)
DB_HOST=${host}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file updated!');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('You can now run: npm run dev');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\nPlease check your MySQL configuration and try again.');
  } finally {
    rl.close();
  }
}

setupDatabase();


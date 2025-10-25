const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabaseWithRetry() {
  console.log('🔧 Setting up MySQL database for ScrapSail...');
  console.log('=====================================');
  
  const configs = [
    // Try with no password first
    {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: '',
      database: process.env.DB_NAME || 'scrapsail'
    },
    // Try with common passwords
    {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: 'root',
      database: process.env.DB_NAME || 'scrapsail'
    },
    {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: 'password',
      database: process.env.DB_NAME || 'scrapsail'
    },
    {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: '123456',
      database: process.env.DB_NAME || 'scrapsail'
    }
  ];

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    console.log(`\n🔍 Attempt ${i + 1}: Trying to connect with password: ${config.password || '(empty)'}`);
    
    try {
      // First connect without database to create it
      const connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password
      });

      console.log('✅ Successfully connected to MySQL server!');
      
      // Create database
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
      console.log(`✅ Database '${config.database}' created or already exists`);
      
      // Switch to the database
      await connection.execute(`USE \`${config.database}\``);

      // Create all tables
      await createTables(connection);
      
      // Insert test data
      await insertTestData(connection);
      
      await connection.end();
      
      // Update .env file with working password
      await updateEnvFile(config.password);
      
      console.log('\n🎉 Database setup completed successfully!');
      console.log(`✅ Working password: ${config.password || '(empty)'}`);
      console.log('✅ Database tables created');
      console.log('✅ Test data inserted');
      console.log('✅ .env file updated');
      
      return true;
      
    } catch (error) {
      console.log(`❌ Attempt ${i + 1} failed: ${error.message}`);
      if (i === configs.length - 1) {
        console.log('\n💡 All connection attempts failed. Please:');
        console.log('1. Check if MySQL service is running');
        console.log('2. Verify MySQL root password');
        console.log('3. Try connecting with MySQL Workbench');
        console.log('4. Or use the mock server: node start-without-db.js');
        return false;
      }
    }
  }
}

async function createTables(connection) {
  console.log('📋 Creating database tables...');
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS pickups (
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS transactions (
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS otps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      type VARCHAR(50) DEFAULT 'pickup',
      expiresAt TIMESTAMP NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_email_otp (email, otp),
      INDEX idx_expires (expiresAt)
    )`,
    
    `CREATE TABLE IF NOT EXISTS email_whitelist (
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
    )`
  ];

  for (const table of tables) {
    await connection.execute(table);
  }
  
  console.log('✅ All tables created successfully');
}

async function insertTestData(connection) {
  console.log('📊 Inserting test data...');
  
  // Insert test users
  await connection.execute(`
    INSERT IGNORE INTO users (name, email, password, role, isVerified, carbonCredits) VALUES
    ('Admin User', 'admin@scrapsail.com', 'admin123', 'admin', true, 1000),
    ('Test Collector', 'collector@scrapsail.com', 'collector123', 'collector', true, 500),
    ('Test User', 'user@scrapsail.com', 'user123', 'user', true, 100)
  `);
  
  console.log('✅ Test users created');
}

async function updateEnvFile(password) {
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.join(__dirname, '.env');
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Update the password in .env file
  content = content.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password}`);
  
  fs.writeFileSync(envPath, content);
  console.log('✅ .env file updated with working password');
}

// Run the setup
setupDatabaseWithRetry().then(success => {
  if (success) {
    console.log('\n🚀 Ready to start the server!');
    console.log('Run: npm run dev');
  } else {
    console.log('\n⚠️  Database setup failed. You can still use the mock server.');
    console.log('Run: node start-without-db.js');
  }
  process.exit(success ? 0 : 1);
});


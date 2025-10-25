#!/usr/bin/env node

/**
 * ScrapSail Database Manager
 * View and manage MySQL database tables
 */

const { pool, testConnection, initializeDatabase } = require('./config/database');

async function showDatabaseInfo() {
  console.log('🗄️ ScrapSail Database Manager\n');
  
  // Test connection
  console.log('1️⃣ Testing database connection...');
  const isConnected = await testConnection();
  
  if (!isConnected) {
    console.log('❌ Cannot connect to database. Please check your MySQL server.');
    return;
  }

  try {
    const connection = await pool.getConnection();
    
    // Show all tables
    console.log('\n2️⃣ Available Tables:');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tables in scrapsail database:');
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
    });

    // Show table structures
    console.log('\n3️⃣ Table Structures:');
    
    const tableNames = ['users', 'pickups', 'transactions', 'otps', 'email_whitelist'];
    
    for (const tableName of tableNames) {
      try {
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        console.log(`\n📊 ${tableName.toUpperCase()} Table:`);
        columns.forEach(col => {
          console.log(`   ${col.Field} - ${col.Type} ${col.Null === 'NO' ? '(Required)' : '(Optional)'}`);
        });
      } catch (error) {
        console.log(`   ⚠️ Table ${tableName} not found`);
      }
    }

    // Show record counts
    console.log('\n4️⃣ Record Counts:');
    for (const tableName of tableNames) {
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   ${tableName}: ${count[0].count} records`);
      } catch (error) {
        console.log(`   ${tableName}: Table not found`);
      }
    }

    // Show sample data
    console.log('\n5️⃣ Sample Data:');
    
    // Users sample
    try {
      const [users] = await connection.execute('SELECT id, name, email, role, carbonCredits FROM users LIMIT 3');
      if (users.length > 0) {
        console.log('\n👥 Sample Users:');
        users.forEach(user => {
          console.log(`   ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Credits: ${user.carbonCredits}`);
        });
      }
    } catch (error) {
      console.log('   No users found');
    }

    // Pickups sample
    try {
      const [pickups] = await connection.execute('SELECT id, userId, wasteCategory, weight, status FROM pickups LIMIT 3');
      if (pickups.length > 0) {
        console.log('\n🗑️ Sample Pickups:');
        pickups.forEach(pickup => {
          console.log(`   ID: ${pickup.id}, User: ${pickup.userId}, Category: ${pickup.wasteCategory}, Weight: ${pickup.weight}kg, Status: ${pickup.status}`);
        });
      }
    } catch (error) {
      console.log('   No pickups found');
    }

    connection.release();
    
    console.log('\n✅ Database information retrieved successfully!');
    console.log('\n💡 To manage your database:');
    console.log('   - Use MySQL Workbench for GUI management');
    console.log('   - Use phpMyAdmin for web-based management');
    console.log('   - Use MySQL command line for direct access');
    
  } catch (error) {
    console.error('❌ Error accessing database:', error.message);
  }
}

// Run the database info
showDatabaseInfo();



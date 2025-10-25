const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing MySQL connection...');
  console.log('Configuration:');
  console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`User: ${process.env.DB_USER || 'root'}`);
  console.log(`Password: ${process.env.DB_PASSWORD ? '***' : '(empty)'}`);
  console.log(`Database: ${process.env.DB_NAME || 'scrapsail'}`);
  console.log('');

  try {
    // Test connection without specifying database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✅ Successfully connected to MySQL server!');
    
    // Test database creation
    const dbName = process.env.DB_NAME || 'scrapsail';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' is ready`);
    
    await connection.end();
    console.log('🎉 Connection test successful!');
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('');
    console.log('💡 Possible solutions:');
    console.log('1. Check if MySQL service is running');
    console.log('2. Verify username and password in .env file');
    console.log('3. Try connecting with MySQL Workbench first');
    console.log('4. Check MySQL error logs');
    return false;
  }
}

testConnection();


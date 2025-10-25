const mysql = require('mysql2/promise');

async function testWithPassword(password) {
  try {
    console.log(`🔍 Testing MySQL connection with password: "${password}"`);
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password,
      port: 3306
    });

    console.log('✅ Successfully connected to MySQL!');
    
    // Test basic query
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log('📊 MySQL Version:', rows[0].version);
    
    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS scrapsail');
    console.log('✅ Database "scrapsail" created');
    
    await connection.end();
    console.log('🎉 MySQL setup completed successfully!');
    
    console.log('\n📝 Update your .env file with:');
    console.log(`DB_PASSWORD=${password}`);
    
    return true;
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  }
}

// Usage: node test-mysql-password.js your_password_here
const password = process.argv[2];
if (!password) {
  console.log('Usage: node test-mysql-password.js <password>');
  console.log('Example: node test-mysql-password.js scrapsail123');
} else {
  testWithPassword(password);
}

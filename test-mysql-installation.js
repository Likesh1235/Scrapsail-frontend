const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  try {
    console.log('🔍 Testing MySQL connection...');
    
    // Try to connect to MySQL server
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Likesh@2006', // Updated with your password
      port: 3306
    });

    console.log('✅ Successfully connected to MySQL server!');
    
    // Test basic query
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log('📊 MySQL Version:', rows[0].version);
    
    await connection.end();
    console.log('🎉 MySQL installation test completed successfully!');
    
  } catch (error) {
    console.log('❌ MySQL connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure MySQL service is running');
    console.log('2. Check if root password is set');
    console.log('3. Verify MySQL is installed correctly');
    console.log('4. Try connecting with MySQL Workbench first');
  }
}

testMySQLConnection();

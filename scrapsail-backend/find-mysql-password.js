const mysql = require('mysql2/promise');

async function testMySQLPasswords() {
  const passwords = ['', 'root', 'password', 'admin', 'mysql'];
  
  console.log('🔍 Testing common MySQL passwords...\n');
  
  for (const password of passwords) {
    try {
      console.log(`Testing password: "${password}" (empty if blank)`);
      
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: password,
        port: 3306
      });

      console.log('✅ SUCCESS! Connected with password:', password || '(empty)');
      
      // Test basic query
      const [rows] = await connection.execute('SELECT VERSION() as version');
      console.log('📊 MySQL Version:', rows[0].version);
      
      await connection.end();
      console.log('🎉 MySQL connection successful!\n');
      
      // Update the test script with the working password
      console.log('📝 Update your .env file with:');
      console.log(`DB_PASSWORD=${password}`);
      
      return password;
      
    } catch (error) {
      console.log('❌ Failed with password:', password || '(empty)');
    }
  }
  
  console.log('\n🔧 None of the common passwords worked.');
  console.log('Please check your MySQL installation log for the root password.');
  console.log('Or reset the root password using MySQL Workbench.');
}

testMySQLPasswords();

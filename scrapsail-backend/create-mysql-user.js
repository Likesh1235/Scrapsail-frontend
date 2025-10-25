const mysql = require('mysql2/promise');

async function createMySQLUser() {
  console.log('🔧 Creating new MySQL user for ScrapSail...\n');
  
  // Try to connect with different methods
  const connectionMethods = [
    { host: 'localhost', user: 'root', password: '', port: 3306 },
    { host: 'localhost', user: 'root', password: 'root', port: 3306 },
    { host: 'localhost', user: 'root', password: 'password', port: 3306 },
    { host: 'localhost', user: 'root', password: 'admin', port: 3306 },
    { host: 'localhost', user: 'root', password: 'mysql', port: 3306 },
    { host: 'localhost', user: 'root', password: '123456', port: 3306 },
  ];
  
  let connection = null;
  
  for (const method of connectionMethods) {
    try {
      console.log(`Trying to connect with password: "${method.password || '(empty)'}"`);
      connection = await mysql.createConnection(method);
      console.log('✅ Connected successfully!');
      break;
    } catch (error) {
      console.log('❌ Failed');
    }
  }
  
  if (!connection) {
    console.log('\n❌ Could not connect to MySQL with any common password.');
    console.log('Please follow the MYSQL_PASSWORD_GUIDE.md to reset the root password.');
    return;
  }
  
  try {
    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS scrapsail');
    console.log('✅ Database "scrapsail" created');
    
    // Create new user
    const newUser = 'scrapsail_user';
    const newPassword = 'scrapsail123';
    
    await connection.execute(`CREATE USER IF NOT EXISTS '${newUser}'@'localhost' IDENTIFIED BY '${newPassword}'`);
    console.log(`✅ User "${newUser}" created`);
    
    // Grant privileges
    await connection.execute(`GRANT ALL PRIVILEGES ON scrapsail.* TO '${newUser}'@'localhost'`);
    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted');
    
    // Test new user connection
    const testConnection = await mysql.createConnection({
      host: 'localhost',
      user: newUser,
      password: newPassword,
      database: 'scrapsail',
      port: 3306
    });
    
    console.log('✅ New user connection test successful!');
    await testConnection.end();
    
    console.log('\n🎉 MySQL setup completed!');
    console.log('\n📝 Update your .env file with:');
    console.log(`DB_USER=${newUser}`);
    console.log(`DB_PASSWORD=${newPassword}`);
    console.log(`DB_NAME=scrapsail`);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    if (connection) await connection.end();
  }
}

createMySQLUser();

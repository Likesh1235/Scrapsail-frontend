const { pool } = require('../config/database');

async function addRazorpayFields() {
  try {
    const connection = await pool.getConnection();
    
    // Add razorpayCustomerId field to users table
    await connection.execute(`
      ALTER TABLE users 
      ADD COLUMN razorpayCustomerId VARCHAR(255) NULL AFTER carbonCredits
    `);
    
    console.log('✅ Added razorpayCustomerId field to users table');
    
    // Add status field to transactions table if it doesn't exist
    await connection.execute(`
      ALTER TABLE transactions 
      ADD COLUMN status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'completed' 
      AFTER metadata
    `);
    
    console.log('✅ Added status field to transactions table');
    
    connection.release();
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Fields already exist, skipping...');
    } else {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  addRazorpayFields()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addRazorpayFields;

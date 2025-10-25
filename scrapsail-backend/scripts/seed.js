const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Pickup = require('../models/Pickup');
const Transaction = require('../models/Transaction');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/scrapsail', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Pickup.deleteMany({});
    await Transaction.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@scrapsail.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      address: {
        street: '123 Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
        country: 'Admin Country'
      },
      isActive: true,
      emailVerified: true,
      carbonCredits: 0
    });
    await adminUser.save();
    console.log('👤 Created admin user');

    // Create collector users
    const collectors = [
      {
        name: 'John Collector',
        email: 'john@scrapsail.com',
        password: 'collector123',
        role: 'collector',
        phone: '+1234567891',
        address: {
          street: '456 Collector Ave',
          city: 'Collector City',
          state: 'Collector State',
          zipCode: '54321',
          country: 'Collector Country'
        }
      },
      {
        name: 'Jane Collector',
        email: 'jane@scrapsail.com',
        password: 'collector123',
        role: 'collector',
        phone: '+1234567892',
        address: {
          street: '789 Collector Blvd',
          city: 'Collector City',
          state: 'Collector State',
          zipCode: '54322',
          country: 'Collector Country'
        }
      }
    ];

    const createdCollectors = [];
    for (const collectorData of collectors) {
      const collector = new User(collectorData);
      await collector.save();
      createdCollectors.push(collector);
      console.log(`🚛 Created collector: ${collector.name}`);
    }

    // Create regular users
    const users = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'user123',
        role: 'user',
        phone: '+1234567893',
        address: {
          street: '123 Green Street',
          city: 'Eco City',
          state: 'Green State',
          zipCode: '11111',
          country: 'Eco Country'
        },
        carbonCredits: 150,
        totalRecycled: 15
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'user123',
        role: 'user',
        phone: '+1234567894',
        address: {
          street: '456 Eco Avenue',
          city: 'Green Town',
          state: 'Green State',
          zipCode: '22222',
          country: 'Eco Country'
        },
        carbonCredits: 280,
        totalRecycled: 28
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: 'user123',
        role: 'user',
        phone: '+1234567895',
        address: {
          street: '789 Sustainable Blvd',
          city: 'Clean City',
          state: 'Clean State',
          zipCode: '33333',
          country: 'Clean Country'
        },
        carbonCredits: 95,
        totalRecycled: 9.5
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }

    // Create sample pickups
    const pickups = [
      {
        user: createdUsers[0]._id,
        wasteCategory: 'Plastic',
        weight: 5.5,
        pickupAddress: '123 Green Street, Eco City',
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'pending',
        carbonCreditsEarned: 55
      },
      {
        user: createdUsers[1]._id,
        wasteCategory: 'Metal',
        weight: 8.2,
        pickupAddress: '456 Eco Avenue, Green Town',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        status: 'assigned',
        assignedCollector: createdCollectors[0]._id,
        carbonCreditsEarned: 123
      },
      {
        user: createdUsers[2]._id,
        wasteCategory: 'E-waste',
        weight: 3.1,
        pickupAddress: '789 Sustainable Blvd, Clean City',
        scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        status: 'completed',
        assignedCollector: createdCollectors[1]._id,
        completionDate: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        carbonCreditsEarned: 78,
        rating: 5,
        feedback: 'Excellent service!'
      }
    ];

    for (const pickupData of pickups) {
      const pickup = new Pickup(pickupData);
      await pickup.save();
      console.log(`♻️  Created pickup: ${pickup.wasteCategory} - ${pickup.weight}kg`);
    }

    // Create sample transactions
    const transactions = [
      {
        user: createdUsers[0]._id,
        type: 'credit',
        amount: 55,
        description: 'Plastic recycling reward',
        status: 'completed',
        metadata: {
          category: 'Plastic',
          weight: 5.5
        },
        balanceAfter: 150
      },
      {
        user: createdUsers[1]._id,
        type: 'credit',
        amount: 123,
        description: 'Metal recycling reward',
        status: 'completed',
        metadata: {
          category: 'Metal',
          weight: 8.2
        },
        balanceAfter: 280
      },
      {
        user: createdUsers[2]._id,
        type: 'redemption',
        amount: -50,
        description: 'Cash redemption',
        status: 'completed',
        metadata: {
          redemptionItem: 'Cash',
          cashValue: 50
        },
        balanceAfter: 45
      }
    ];

    for (const transactionData of transactions) {
      const transaction = new Transaction(transactionData);
      await transaction.save();
      console.log(`💰 Created transaction: ${transaction.type} - ${transaction.amount}`);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Admin: admin@scrapsail.com / admin123');
    console.log('Collector: john@scrapsail.com / collector123');
    console.log('User: alice@example.com / user123');
    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();

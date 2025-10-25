const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'redemption', 'bonus', 'penalty', 'withdrawal'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  pickup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  metadata: {
    category: String,
    weight: Number,
    redemptionItem: String,
    bonusReason: String
  },
  balanceAfter: {
    type: Number
  }
}, {
  timestamps: true
});

// Calculate balance after transaction
transactionSchema.pre('save', async function(next) {
  if (this.isModified('amount') && this.status === 'completed') {
    try {
      const user = await mongoose.model('User').findById(this.user);
      if (user) {
        if (this.type === 'credit' || this.type === 'bonus') {
          this.balanceAfter = user.carbonCredits + this.amount;
        } else if (this.type === 'debit' || this.type === 'redemption' || this.type === 'penalty' || this.type === 'withdrawal') {
          this.balanceAfter = user.carbonCredits - this.amount;
        }
      }
    } catch (error) {
      next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);

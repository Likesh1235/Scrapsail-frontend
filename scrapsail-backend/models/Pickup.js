const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wasteCategory: {
    type: String,
    required: [true, 'Waste category is required'],
    enum: ['Plastic', 'Metal', 'Paper', 'E-waste', 'Organic', 'Mixed']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0.1, 'Weight must be at least 0.1 kg']
  },
  pickupAddress: {
    type: String,
    required: [true, 'Pickup address is required'],
    trim: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'admin-approved', 'admin-rejected', 'collector-assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  carbonCreditsEarned: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  },
  collectorNotes: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    caption: String
  }],
  completionDate: {
    type: Date
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Calculate carbon credits based on weight and category
pickupSchema.pre('save', function(next) {
  if (this.isModified('weight') && this.status === 'completed') {
    const creditRates = {
      'Plastic': 10,
      'Metal': 15,
      'Paper': 8,
      'E-waste': 25,
      'Organic': 5,
      'Mixed': 12
    };
    
    this.carbonCreditsEarned = Math.round(this.weight * creditRates[this.wasteCategory]);
  }
  next();
});

module.exports = mongoose.model('Pickup', pickupSchema);

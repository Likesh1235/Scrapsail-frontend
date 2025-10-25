const Pickup = require('../models/Pickup');
const User = require('../models/User');

// Create pickup request (after OTP verification)
const createPickup = async (req, res) => {
  try {
    const { wasteCategory, weight, pickupAddress, scheduledDate, coordinates, email } = req.body;
    const userId = req.user.id;

    const pickup = new Pickup({
      user: userId,
      wasteCategory,
      weight,
      pickupAddress,
      scheduledDate,
      coordinates,
      status: 'pending' // Starts as pending for admin review
    });

    await pickup.save();
    await pickup.populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Pickup request submitted successfully! Waiting for admin approval.',
      pickup
    });

  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({ message: 'Failed to create pickup request' });
  }
};

// Get user's pickup requests
const getUserPickups = async (req, res) => {
  try {
    const userId = req.user.id;
    const pickups = await Pickup.find({ user: userId })
      .populate('assignedCollector', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pickups
    });

  } catch (error) {
    console.error('Get user pickups error:', error);
    res.status(500).json({ message: 'Failed to fetch pickup requests' });
  }
};

// Admin: Get all pending pickup requests
const getPendingPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ status: 'pending' })
      .populate('user', 'name email phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pickups
    });

  } catch (error) {
    console.error('Get pending pickups error:', error);
    res.status(500).json({ message: 'Failed to fetch pending pickups' });
  }
};

// Admin: Approve pickup request
const approvePickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { adminNotes } = req.body;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (pickup.status !== 'pending') {
      return res.status(400).json({ message: 'Pickup request is not pending' });
    }

    pickup.status = 'admin-approved';
    pickup.adminNotes = adminNotes;
    await pickup.save();

    res.status(200).json({
      success: true,
      message: 'Pickup request approved successfully!',
      pickup
    });

  } catch (error) {
    console.error('Approve pickup error:', error);
    res.status(500).json({ message: 'Failed to approve pickup request' });
  }
};

// Admin: Reject pickup request
const rejectPickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { adminNotes } = req.body;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (pickup.status !== 'pending') {
      return res.status(400).json({ message: 'Pickup request is not pending' });
    }

    pickup.status = 'admin-rejected';
    pickup.adminNotes = adminNotes;
    await pickup.save();

    res.status(200).json({
      success: true,
      message: 'Pickup request rejected',
      pickup
    });

  } catch (error) {
    console.error('Reject pickup error:', error);
    res.status(500).json({ message: 'Failed to reject pickup request' });
  }
};

// Admin: Assign collector to approved pickup
const assignCollector = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { collectorId } = req.body;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (pickup.status !== 'admin-approved') {
      return res.status(400).json({ message: 'Pickup request must be approved first' });
    }

    const collector = await User.findById(collectorId);
    if (!collector || collector.role !== 'collector') {
      return res.status(400).json({ message: 'Invalid collector' });
    }

    pickup.assignedCollector = collectorId;
    pickup.status = 'collector-assigned';
    await pickup.save();

    await pickup.populate('assignedCollector', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Collector assigned successfully!',
      pickup
    });

  } catch (error) {
    console.error('Assign collector error:', error);
    res.status(500).json({ message: 'Failed to assign collector' });
  }
};

// Collector: Get assigned pickup requests
const getCollectorPickups = async (req, res) => {
  try {
    const collectorId = req.user.id;
    const pickups = await Pickup.find({ 
      assignedCollector: collectorId,
      status: { $in: ['collector-assigned', 'collector-accepted', 'in-progress'] }
    })
      .populate('user', 'name email phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pickups
    });

  } catch (error) {
    console.error('Get collector pickups error:', error);
    res.status(500).json({ message: 'Failed to fetch assigned pickups' });
  }
};

// Collector: Accept pickup request
const acceptPickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { collectorNotes } = req.body;
    const collectorId = req.user.id;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (pickup.assignedCollector.toString() !== collectorId) {
      return res.status(403).json({ message: 'You are not assigned to this pickup' });
    }

    if (pickup.status !== 'collector-assigned') {
      return res.status(400).json({ message: 'Pickup request is not assigned to you' });
    }

    pickup.status = 'collector-accepted';
    pickup.collectorNotes = collectorNotes;
    await pickup.save();

    res.status(200).json({
      success: true,
      message: 'Pickup request accepted! You can now proceed to collect.',
      pickup
    });

  } catch (error) {
    console.error('Accept pickup error:', error);
    res.status(500).json({ message: 'Failed to accept pickup request' });
  }
};

// Collector: Start pickup (mark as in-progress)
const startPickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const collectorId = req.user.id;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (pickup.assignedCollector.toString() !== collectorId) {
      return res.status(403).json({ message: 'You are not assigned to this pickup' });
    }

    if (pickup.status !== 'collector-accepted') {
      return res.status(400).json({ message: 'Pickup request must be accepted first' });
    }

    pickup.status = 'in-progress';
    await pickup.save();

    res.status(200).json({
      success: true,
      message: 'Pickup started! You are now collecting the waste.',
      pickup
    });

  } catch (error) {
    console.error('Start pickup error:', error);
    res.status(500).json({ message: 'Failed to start pickup' });
  }
};

// Collector: Complete pickup
const completePickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { collectorNotes } = req.body;
    const collectorId = req.user.id;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (pickup.assignedCollector.toString() !== collectorId) {
      return res.status(403).json({ message: 'You are not assigned to this pickup' });
    }

    if (pickup.status !== 'in-progress') {
      return res.status(400).json({ message: 'Pickup must be in progress to complete' });
    }

    pickup.status = 'completed';
    pickup.completionDate = new Date();
    pickup.collectorNotes = collectorNotes;
    
    // Calculate carbon credits
    const creditRates = {
      'Plastic': 10,
      'Metal': 15,
      'Paper': 8,
      'E-waste': 25,
      'Organic': 5,
      'Mixed': 12
    };
    
    pickup.carbonCreditsEarned = Math.round(pickup.weight * creditRates[pickup.wasteCategory]);
    
    await pickup.save();

    // Update user's carbon credits
    await User.findByIdAndUpdate(pickup.user, {
      $inc: { carbonCredits: pickup.carbonCreditsEarned }
    });

    res.status(200).json({
      success: true,
      message: 'Pickup completed successfully!',
      pickup
    });

  } catch (error) {
    console.error('Complete pickup error:', error);
    res.status(500).json({ message: 'Failed to complete pickup' });
  }
};

module.exports = {
  createPickup,
  getUserPickups,
  getPendingPickups,
  approvePickup,
  rejectPickup,
  assignCollector,
  getCollectorPickups,
  acceptPickup,
  startPickup,
  completePickup
};


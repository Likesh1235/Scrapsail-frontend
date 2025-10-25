const express = require('express');
const PickupService = require('../services/pickupService');
const UserService = require('../services/userService');
const TransactionService = require('../services/transactionService');
const { verifyToken, checkUser, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/collector/dashboard
// @desc    Get collector dashboard data
// @access  Private (Collector)
router.get('/dashboard', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const collectorId = req.user.id;

    // Get assigned pickups
    const assignedPickups = await PickupService.getAssignedPickups(collectorId);

    // Calculate statistics
    const totalPickups = assignedPickups.length;
    const completedPickups = assignedPickups.filter(p => p.status === 'completed').length;
    const pendingPickups = assignedPickups.filter(p => p.status === 'collector-assigned').length;
    const inProgressPickups = assignedPickups.filter(p => p.status === 'in-progress').length;

    // Calculate total weight collected
    const totalWeight = assignedPickups
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.weight, 0);

    // Calculate earnings (simulated)
    const earningsPerPickup = 25; // $25 per pickup
    const totalEarnings = completedPickups * earningsPerPickup;

    res.json({
      success: true,
      stats: {
        totalPickups,
        completedPickups,
        pendingPickups,
        inProgressPickups,
        totalWeight,
        totalEarnings
      },
      assignedPickups
    });

  } catch (error) {
    console.error('Get collector dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// @route   GET /api/collector/pickups
// @desc    Get collector's assigned pickups
// @access  Private (Collector)
router.get('/pickups', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const assignedPickups = await PickupService.getAssignedPickups(req.user.id);

    // Filter by status if provided
    let filteredPickups = assignedPickups;
    if (status) {
      filteredPickups = assignedPickups.filter(p => p.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPickups = filteredPickups.slice(startIndex, endIndex);

    res.json({
      success: true,
      pickups: paginatedPickups,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredPickups.length / limit),
        total: filteredPickups.length
      }
    });

  } catch (error) {
    console.error('Get collector pickups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pickups'
    });
  }
});

// @route   PUT /api/collector/pickups/:id/start
// @desc    Start pickup
// @access  Private (Collector)
router.put('/pickups/:id/start', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const pickup = await PickupService.findById(req.params.id);
    
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    if (pickup.assignedCollector._id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (pickup.status !== 'collector-assigned' && pickup.status !== 'collector-accepted') {
      return res.status(400).json({
        success: false,
        message: 'Pickup cannot be started'
      });
    }

    const updatedPickup = await PickupService.updateStatus(req.params.id, 'in-progress');

    res.json({
      success: true,
      message: 'Pickup started successfully',
      pickup: updatedPickup
    });

  } catch (error) {
    console.error('Start pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start pickup'
    });
  }
});

// @route   PUT /api/collector/pickups/:id/complete
// @desc    Complete pickup
// @access  Private (Collector)
router.put('/pickups/:id/complete', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const { actualWeight, notes, rating } = req.body;
    
    const pickup = await PickupService.findById(req.params.id);
    
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    if (pickup.assignedCollector._id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (pickup.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Pickup must be in progress to complete'
      });
    }

    // Complete the pickup
    const completedPickup = await PickupService.completePickup(req.params.id);

    res.json({
      success: true,
      message: 'Pickup completed successfully',
      pickup: completedPickup
    });

  } catch (error) {
    console.error('Complete pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete pickup'
    });
  }
});

// @route   GET /api/collector/route
// @desc    Get optimized route for today's pickups
// @access  Private (Collector)
router.get('/route', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const assignedPickups = await PickupService.getAssignedPickups(req.user.id);

    // Filter for today's pickups
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayPickups = assignedPickups.filter(pickup => {
      const pickupDate = new Date(pickup.scheduledDate);
      return pickupDate >= today && pickupDate < tomorrow;
    });

    // Simple route optimization (in real app, you'd use a proper routing algorithm)
    const optimizedRoute = todayPickups.map((pickup, index) => ({
      order: index + 1,
      pickup: {
        id: pickup._id,
        customer: pickup.user.name,
        address: pickup.pickupAddress,
        phone: pickup.user.phone,
        wasteType: pickup.wasteCategory,
        weight: pickup.weight,
        scheduledTime: pickup.scheduledDate,
        status: pickup.status
      }
    }));

    res.json({
      success: true,
      route: optimizedRoute,
      totalPickups: todayPickups.length,
      estimatedTime: todayPickups.length * 30 // 30 minutes per pickup
    });

  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route'
    });
  }
});

// @route   GET /api/collector/earnings
// @desc    Get collector earnings
// @access  Private (Collector)
router.get('/earnings', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get assigned pickups
    const assignedPickups = await PickupService.getAssignedPickups(req.user.id);

    // Filter completed pickups in the period
    const completedPickups = assignedPickups.filter(pickup => {
      return pickup.status === 'completed' && 
             pickup.completionDate && 
             new Date(pickup.completionDate) >= startDate;
    });

    const earningsPerPickup = 25; // $25 per pickup
    const totalEarnings = completedPickups.length * earningsPerPickup;
    const totalWeight = completedPickups.reduce((sum, pickup) => sum + pickup.weight, 0);

    res.json({
      success: true,
      earnings: {
        totalEarnings,
        totalPickups: completedPickups.length,
        totalWeight,
        averagePerPickup: completedPickups.length > 0 ? totalEarnings / completedPickups.length : 0
      }
    });

  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earnings'
    });
  }
});

module.exports = router;
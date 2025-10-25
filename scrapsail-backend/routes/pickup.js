const express = require('express');
const PickupService = require('../services/pickupService');
const UserService = require('../services/userService');
const { verifyToken, checkUser, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/pickup
// @desc    Create a new pickup request
// @access  Private (User)
router.post('/', verifyToken, checkUser, authorize('user'), async (req, res) => {
  try {
    const { wasteCategory, weight, pickupAddress, scheduledDate, coordinates } = req.body;

    // Validation
    if (!wasteCategory || !weight || !pickupAddress || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create pickup request
    const pickup = await PickupService.createPickup({
      userId: req.user.id,
      wasteCategory,
      weight: parseFloat(weight),
      pickupAddress,
      scheduledDate: new Date(scheduledDate),
      coordinates: coordinates ? {
        latitude: parseFloat(coordinates.latitude),
        longitude: parseFloat(coordinates.longitude)
      } : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Pickup request created successfully',
      pickup
    });

  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pickup request'
    });
  }
});

// @route   GET /api/pickup
// @desc    Get user's pickup requests
// @access  Private (User)
router.get('/', verifyToken, checkUser, authorize('user'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const result = await PickupService.getUserPickups(req.user.id, status, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      pickups: result.pickups,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get pickups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pickup requests'
    });
  }
});

// @route   GET /api/pickup/:id
// @desc    Get specific pickup request
// @access  Private
router.get('/:id', verifyToken, checkUser, async (req, res) => {
  try {
    const pickup = await PickupService.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    // Check if user has access to this pickup
    if (req.user.role === 'user' && pickup.user._id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      pickup
    });

  } catch (error) {
    console.error('Get pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pickup request'
    });
  }
});

// @route   GET /api/pickup/admin/pending
// @desc    Get pending pickup requests for admin
// @access  Private (Admin)
router.get('/admin/pending', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const pickups = await PickupService.getPendingPickups();

    res.json({
      success: true,
      pickups
    });

  } catch (error) {
    console.error('Get pending pickups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending pickup requests'
    });
  }
});

// @route   GET /api/pickup/collector/assigned
// @desc    Get assigned pickup requests for collector
// @access  Private (Collector)
router.get('/collector/assigned', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const pickups = await PickupService.getAssignedPickups(req.user.id);

    res.json({
      success: true,
      pickups
    });

  } catch (error) {
    console.error('Get assigned pickups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned pickup requests'
    });
  }
});

// @route   PUT /api/pickup/:id/approve
// @desc    Approve pickup request
// @access  Private (Admin)
router.put('/:id/approve', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const pickup = await PickupService.updateStatus(req.params.id, 'admin-approved', adminNotes, 'adminNotes');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    res.json({
      success: true,
      message: 'Pickup request approved successfully',
      pickup
    });

  } catch (error) {
    console.error('Approve pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve pickup request'
    });
  }
});

// @route   PUT /api/pickup/:id/reject
// @desc    Reject pickup request
// @access  Private (Admin)
router.put('/:id/reject', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const pickup = await PickupService.updateStatus(req.params.id, 'admin-rejected', adminNotes, 'adminNotes');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    res.json({
      success: true,
      message: 'Pickup request rejected',
      pickup
    });

  } catch (error) {
    console.error('Reject pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject pickup request'
    });
  }
});

// @route   PUT /api/pickup/:id/assign
// @desc    Assign collector to pickup request
// @access  Private (Admin)
router.put('/:id/assign', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const { collectorId } = req.body;

    if (!collectorId) {
      return res.status(400).json({
        success: false,
        message: 'Collector ID is required'
      });
    }

    const pickup = await PickupService.assignCollector(req.params.id, collectorId);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    res.json({
      success: true,
      message: 'Collector assigned successfully',
      pickup
    });

  } catch (error) {
    console.error('Assign collector error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign collector'
    });
  }
});

// @route   PUT /api/pickup/:id/accept
// @desc    Accept pickup request by collector
// @access  Private (Collector)
router.put('/:id/accept', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const { collectorNotes } = req.body;

    const pickup = await PickupService.updateStatus(req.params.id, 'collector-accepted', collectorNotes, 'collectorNotes');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    res.json({
      success: true,
      message: 'Pickup request accepted successfully',
      pickup
    });

  } catch (error) {
    console.error('Accept pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept pickup request'
    });
  }
});

// @route   PUT /api/pickup/:id/start
// @desc    Start pickup collection
// @access  Private (Collector)
router.put('/:id/start', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const pickup = await PickupService.updateStatus(req.params.id, 'in-progress');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    res.json({
      success: true,
      message: 'Pickup collection started successfully',
      pickup
    });

  } catch (error) {
    console.error('Start pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start pickup collection'
    });
  }
});

// @route   PUT /api/pickup/:id/complete
// @desc    Complete pickup collection
// @access  Private (Collector)
router.put('/:id/complete', verifyToken, checkUser, authorize('collector'), async (req, res) => {
  try {
    const pickup = await PickupService.completePickup(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    res.json({
      success: true,
      message: 'Pickup collection completed successfully',
      pickup
    });

  } catch (error) {
    console.error('Complete pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete pickup collection'
    });
  }
});

module.exports = router;
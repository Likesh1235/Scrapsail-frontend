const express = require('express');
const UserService = require('../services/userService');
const PickupService = require('../services/pickupService');
const TransactionService = require('../services/transactionService');
const { verifyToken, checkUser, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get('/dashboard', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    // Get user statistics
    const userStats = await UserService.getAllUsers(1, 1000, 'user');
    const collectorStats = await UserService.getAllUsers(1, 1000, 'collector');
    const adminStats = await UserService.getAllUsers(1, 1000, 'admin');

    // Get pickup statistics
    const pendingPickups = await PickupService.getPendingPickups();
    const assignedPickups = await PickupService.getAssignedPickups(null); // Get all assigned pickups

    // Calculate totals
    const totalUsers = userStats.pagination.total;
    const totalCollectors = collectorStats.pagination.total;
    const totalAdmins = adminStats.pagination.total;
    const totalPickups = pendingPickups.length + assignedPickups.length;
    const completedPickups = assignedPickups.filter(p => p.status === 'completed').length;
    const inProgressPickups = assignedPickups.filter(p => p.status === 'in-progress').length;

    // Calculate total recycled weight
    const totalRecycled = assignedPickups
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.weight, 0);

    // Calculate total carbon credits issued
    const totalCreditsIssued = assignedPickups
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.carbonCreditsEarned || 0), 0);

    // Get monthly revenue (simulated)
    const monthlyRevenue = totalCreditsIssued * (process.env.REDEMPTION_RATE || 1);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCollectors,
        totalAdmins,
        totalPickups,
        completedPickups,
        pendingPickups: pendingPickups.length,
        inProgressPickups,
        totalRecycled,
        monthlyRevenue,
        carbonCreditsIssued: totalCreditsIssued
      },
      recentActivities: {
        pickups: [...pendingPickups, ...assignedPickups].slice(0, 5),
        users: userStats.users.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    
    const result = await UserService.getAllUsers(parseInt(page), parseInt(limit), role);

    // Filter by search if provided
    let users = result.users;
    if (search) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      users,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin)
router.put('/users/:id', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const { name, email, role, accountStatus } = req.body;

    const user = await UserService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (accountStatus) updateData.accountStatus = accountStatus;

    const updatedUser = await UserService.updateUser(user.id, updateData);

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        accountStatus: updatedUser.accountStatus
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:id', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const user = await UserService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate user
    await UserService.updateUser(user.id, { accountStatus: 'inactive' });

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// @route   GET /api/admin/collectors
// @desc    Get all collectors
// @access  Private (Admin)
router.get('/collectors', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const collectors = await UserService.getCollectors();

    res.json({
      success: true,
      collectors
    });

  } catch (error) {
    console.error('Get collectors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collectors'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private (Admin)
router.get('/analytics', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get wallet statistics
    const walletStats = await TransactionService.getWalletStats();

    res.json({
      success: true,
      analytics: {
        totalUsers: walletStats.totalUsers,
        totalCredits: walletStats.totalCredits,
        totalTransactions: walletStats.totalTransactions,
        totalRedemptions: walletStats.totalRedemptions,
        recentTransactions: walletStats.recentTransactions
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

module.exports = router;
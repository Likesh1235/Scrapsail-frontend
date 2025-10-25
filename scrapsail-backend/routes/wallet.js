const express = require('express');
const UserService = require('../services/userService');
const TransactionService = require('../services/transactionService');
const RazorpayService = require('../services/razorpayService');
const { verifyToken, checkUser, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/wallet/:userId
// @desc    Get user's wallet information
// @access  Private
router.get('/:userId', verifyToken, checkUser, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user has access to this wallet
    if (req.user.role === 'user' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await UserService.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent transactions
    const transactions = await TransactionService.getRecentTransactions(userId, 10);

    res.json({
      success: true,
      wallet: {
        totalCredits: user.carbonCredits,
        cashBalance: user.carbonCredits * (process.env.REDEMPTION_RATE || 1), // 1 credit = 1 rupee
        totalRecycled: user.totalRecycled,
        lastRedeem: transactions.find(t => t.type === 'redemption')?.amount || 0,
        remainingPoints: user.carbonCredits,
        rate: `₹${process.env.REDEMPTION_RATE || 1}/point`
      },
      transactions
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet information'
    });
  }
});

// @route   GET /api/wallet/:userId/transactions
// @desc    Get user's transaction history
// @access  Private
router.get('/:userId/transactions', verifyToken, checkUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 20, type } = req.query;

    // Check if user has access to this wallet
    if (req.user.role === 'user' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const result = await TransactionService.getUserTransactions(userId, type, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      transactions: result.transactions,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history'
    });
  }
});

// @route   POST /api/wallet/:userId/redeem
// @desc    Redeem carbon credits for cash
// @access  Private (User)
router.post('/:userId/redeem', verifyToken, checkUser, authorize('user'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { amount, redemptionItem } = req.body;

    // Check if user has access to this wallet
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid redemption amount'
      });
    }

    const user = await UserService.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.carbonCredits < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient carbon credits'
      });
    }

    // Update user's carbon credits
    const newBalance = user.carbonCredits - amount;
    await UserService.updateUser(user.id, { carbonCredits: newBalance });

    // Create transaction record
    const transaction = await TransactionService.createTransaction({
      userId: user.id,
      type: 'redemption',
      amount: -amount,
      description: redemptionItem || 'Cash redemption',
      balanceAfter: newBalance,
      metadata: {
        redemptionItem: redemptionItem || 'Cash',
        cashValue: amount * (process.env.REDEMPTION_RATE || 1)
      }
    });

    res.json({
      success: true,
      message: 'Redemption successful',
      transaction,
      newBalance
    });

  } catch (error) {
    console.error('Redeem credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Redemption failed. Please try again.'
    });
  }
});

// @route   POST /api/wallet/:userId/add-credits
// @desc    Add carbon credits (Admin only)
// @access  Private (Admin)
router.post('/:userId/add-credits', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { amount, reason = 'Manual credit addition' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit amount'
      });
    }

    const user = await UserService.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user's carbon credits
    const newBalance = user.carbonCredits + amount;
    await UserService.updateUser(user.id, { carbonCredits: newBalance });

    // Create transaction record
    const transaction = await TransactionService.createTransaction({
      userId: user.id,
      type: 'bonus',
      amount: amount,
      description: reason,
      balanceAfter: newBalance,
      metadata: {
        bonusReason: reason
      }
    });

    res.json({
      success: true,
      message: 'Credits added successfully',
      transaction,
      newBalance
    });

  } catch (error) {
    console.error('Add credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add credits. Please try again.'
    });
  }
});

// @route   GET /api/wallet/admin/stats
// @desc    Get wallet statistics (Admin)
// @access  Private (Admin)
router.get('/admin/stats', verifyToken, checkUser, authorize('admin'), async (req, res) => {
  try {
    const stats = await TransactionService.getWalletStats();

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get wallet stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet statistics'
    });
  }
});

// @route   POST /api/wallet/:userId/withdraw
// @desc    Withdraw carbon credits to bank account via Razorpay
// @access  Private (User)
router.post('/:userId/withdraw', verifyToken, checkUser, authorize('user'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { 
      amount, 
      accountHolderName, 
      accountNumber, 
      ifscCode, 
      bankName,
      contact 
    } = req.body;

    // Check if user has access to this wallet
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid withdrawal amount'
      });
    }

    if (!accountHolderName || !accountNumber || !ifscCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required bank account details'
      });
    }

    const user = await UserService.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has sufficient credits
    const cashValue = amount * (process.env.REDEMPTION_RATE || 1);
    if (user.carbonCredits < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient carbon credits'
      });
    }

    // Minimum withdrawal amount (₹100)
    if (cashValue < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is ₹100'
      });
    }

    try {
      // Create or get Razorpay customer
      let customerId = user.razorpayCustomerId;
      if (!customerId) {
        const customer = await RazorpayService.createCustomer({
          name: user.name || accountHolderName,
          email: user.email,
          contact: contact || user.phone
        });
        customerId = customer.id;
        
        // Update user with Razorpay customer ID
        await UserService.updateUser(user.id, { razorpayCustomerId: customerId });
      }

      // Create fund account
      const fundAccount = await RazorpayService.createFundAccount({
        customerId: customerId,
        accountHolderName: accountHolderName,
        accountNumber: accountNumber,
        ifscCode: ifscCode
      });

      // Create payout
      const payout = await RazorpayService.createPayout({
        accountNumber: accountNumber,
        accountHolderName: accountHolderName,
        ifscCode: ifscCode,
        amount: cashValue,
        referenceId: `withdrawal_${user.id}_${Date.now()}`,
        narration: `Carbon Credit Withdrawal - ${user.name || user.email}`
      });

      // Update user's carbon credits
      const newBalance = user.carbonCredits - amount;
      await UserService.updateUser(user.id, { carbonCredits: newBalance });

      // Create transaction record
      const transaction = await TransactionService.createTransaction({
        userId: user.id,
        type: 'withdrawal',
        amount: -amount,
        description: `Withdrawal to ${bankName || 'Bank Account'} - ${accountNumber.slice(-4)}`,
        balanceAfter: newBalance,
        status: 'pending',
        metadata: {
          payoutId: payout.id,
          fundAccountId: fundAccount.id,
          accountHolderName: accountHolderName,
          accountNumber: accountNumber,
          ifscCode: ifscCode,
          bankName: bankName,
          cashValue: cashValue,
          razorpayStatus: payout.status
        }
      });

      res.json({
        success: true,
        message: 'Withdrawal request submitted successfully',
        transaction,
        payout: {
          id: payout.id,
          status: payout.status,
          amount: cashValue,
          accountNumber: accountNumber.slice(-4)
        },
        newBalance
      });

    } catch (razorpayError) {
      console.error('Razorpay withdrawal error:', razorpayError);
      return res.status(500).json({
        success: false,
        message: `Withdrawal failed: ${razorpayError.message}`
      });
    }

  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Withdrawal failed. Please try again.'
    });
  }
});

// @route   GET /api/wallet/:userId/withdrawals
// @desc    Get user's withdrawal history
// @access  Private (User)
router.get('/:userId/withdrawals', verifyToken, checkUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 10 } = req.query;

    // Check if user has access to this wallet
    if (req.user.role === 'user' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const result = await TransactionService.getUserTransactions(userId, 'withdrawal', parseInt(page), parseInt(limit));

    res.json({
      success: true,
      withdrawals: result.transactions,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawal history'
    });
  }
});

// @route   GET /api/wallet/:userId/withdrawal/:transactionId/status
// @desc    Get withdrawal status from Razorpay
// @access  Private (User)
router.get('/:userId/withdrawal/:transactionId/status', verifyToken, checkUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactionId = req.params.transactionId;

    // Check if user has access to this wallet
    if (req.user.role === 'user' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get transaction
    const transaction = await TransactionService.getTransactionById(transactionId);
    if (!transaction || transaction.userId !== parseInt(userId)) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.type !== 'withdrawal') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction type'
      });
    }

    // Get payout status from Razorpay
    const payoutStatus = await RazorpayService.getPayoutStatus(transaction.metadata.payoutId);

    // Update transaction status if changed
    if (transaction.status !== payoutStatus.status) {
      await TransactionService.updateTransactionStatus(transactionId, payoutStatus.status);
    }

    res.json({
      success: true,
      status: payoutStatus.status,
      payout: {
        id: payoutStatus.id,
        status: payoutStatus.status,
        amount: payoutStatus.amount / 100, // Convert from paise
        utr: payoutStatus.utr,
        created_at: payoutStatus.created_at,
        processed_at: payoutStatus.processed_at
      }
    });

  } catch (error) {
    console.error('Get withdrawal status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawal status'
    });
  }
});

module.exports = router;
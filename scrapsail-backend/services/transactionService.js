const { pool } = require('../config/database');

class TransactionService {
  // Create a new transaction
  static async createTransaction(transactionData) {
    try {
      const { userId, type, amount, description, relatedPickupId, balanceAfter, metadata } = transactionData;

      const [result] = await pool.execute(
        `INSERT INTO transactions (userId, type, amount, description, relatedPickupId, balanceAfter, metadata) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          type,
          parseFloat(amount),
          description,
          relatedPickupId || null,
          balanceAfter ? parseFloat(balanceAfter) : null,
          metadata ? JSON.stringify(metadata) : null
        ]
      );

      return await this.findById(result.insertId);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Find transaction by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT t.*, u.name as userName, u.email as userEmail,
                p.wasteCategory, p.weight
         FROM transactions t
         LEFT JOIN users u ON t.userId = u.id
         LEFT JOIN pickups p ON t.relatedPickupId = p.id
         WHERE t.id = ?`,
        [id]
      );

      if (rows.length === 0) return null;

      const transaction = rows[0];
      return {
        _id: transaction.id,
        user: {
          _id: transaction.userId,
          name: transaction.userName,
          email: transaction.userEmail
        },
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        relatedPickup: transaction.relatedPickupId ? {
          _id: transaction.relatedPickupId,
          wasteCategory: transaction.wasteCategory,
          weight: transaction.weight
        } : null,
        balanceAfter: transaction.balanceAfter,
        metadata: transaction.metadata ? JSON.parse(transaction.metadata) : null,
        createdAt: transaction.createdAt
      };
    } catch (error) {
      console.error('Error finding transaction by ID:', error);
      return null;
    }
  }

  // Get user's transactions
  static async getUserTransactions(userId, type = null, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT t.*, p.wasteCategory, p.weight
        FROM transactions t
        LEFT JOIN pickups p ON t.relatedPickupId = p.id
        WHERE t.userId = ?
      `;
      let params = [userId];

      if (type) {
        query += ' AND t.type = ?';
        params.push(type);
      }

      query += ' ORDER BY t.createdAt DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [transactions] = await pool.execute(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE userId = ?';
      let countParams = [userId];
      if (type) {
        countQuery += ' AND type = ?';
        countParams.push(type);
      }

      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;

      return {
        transactions: transactions.map(transaction => ({
          _id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          relatedPickup: transaction.relatedPickupId ? {
            _id: transaction.relatedPickupId,
            wasteCategory: transaction.wasteCategory,
            weight: transaction.weight
          } : null,
          balanceAfter: transaction.balanceAfter,
          metadata: transaction.metadata ? JSON.parse(transaction.metadata) : null,
          createdAt: transaction.createdAt
        })),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      };
    } catch (error) {
      console.error('Error getting user transactions:', error);
      throw error;
    }
  }

  // Get recent transactions for wallet
  static async getRecentTransactions(userId, limit = 10) {
    try {
      const [rows] = await pool.execute(
        `SELECT t.*, p.wasteCategory, p.weight
         FROM transactions t
         LEFT JOIN pickups p ON t.relatedPickupId = p.id
         WHERE t.userId = ?
         ORDER BY t.createdAt DESC
         LIMIT ?`,
        [userId, limit]
      );

      return rows.map(transaction => ({
        _id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        relatedPickup: transaction.relatedPickupId ? {
          _id: transaction.relatedPickupId,
          wasteCategory: transaction.wasteCategory,
          weight: transaction.weight
        } : null,
        balanceAfter: transaction.balanceAfter,
        metadata: transaction.metadata ? JSON.parse(transaction.metadata) : null,
        createdAt: transaction.createdAt
      }));
    } catch (error) {
      console.error('Error getting recent transactions:', error);
      return [];
    }
  }

  // Get wallet statistics for admin
  static async getWalletStats() {
    try {
      // Total users
      const [userCount] = await pool.execute('SELECT COUNT(*) as total FROM users WHERE role = "user"');
      const totalUsers = userCount[0].total;

      // Total credits
      const [creditsSum] = await pool.execute('SELECT SUM(carbonCredits) as total FROM users WHERE role = "user"');
      const totalCredits = creditsSum[0].total || 0;

      // Total transactions
      const [transactionCount] = await pool.execute('SELECT COUNT(*) as total FROM transactions');
      const totalTransactions = transactionCount[0].total;

      // Total redemptions
      const [redemptionsSum] = await pool.execute('SELECT SUM(ABS(amount)) as total FROM transactions WHERE type = "redemption"');
      const totalRedemptions = redemptionsSum[0].total || 0;

      // Recent transactions
      const [recentTransactions] = await pool.execute(
        `SELECT t.*, u.name as userName, u.email as userEmail, p.wasteCategory, p.weight
         FROM transactions t
         LEFT JOIN users u ON t.userId = u.id
         LEFT JOIN pickups p ON t.relatedPickupId = p.id
         ORDER BY t.createdAt DESC
         LIMIT 10`
      );

      return {
        totalUsers,
        totalCredits,
        totalTransactions,
        totalRedemptions,
        recentTransactions: recentTransactions.map(transaction => ({
          _id: transaction.id,
          user: {
            _id: transaction.userId,
            name: transaction.userName,
            email: transaction.userEmail
          },
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          relatedPickup: transaction.relatedPickupId ? {
            _id: transaction.relatedPickupId,
            wasteCategory: transaction.wasteCategory,
            weight: transaction.weight
          } : null,
          createdAt: transaction.createdAt
        }))
      };
    } catch (error) {
      console.error('Error getting wallet stats:', error);
      throw error;
    }
  }

  // Get transaction by ID (alias for findById)
  static async getTransactionById(id) {
    return await this.findById(id);
  }

  // Update transaction status
  static async updateTransactionStatus(id, status) {
    try {
      await pool.execute(
        'UPDATE transactions SET status = ? WHERE id = ?',
        [status, id]
      );
      return await this.findById(id);
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }
}


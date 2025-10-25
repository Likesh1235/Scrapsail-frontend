const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EmailWhitelistService = require('./emailWhitelistService');

class UserService {
  // Create a new user
  static async createUser(userData) {
    try {
      const { name, email, password, role = 'user', phone, address } = userData;

      // Validate role assignment
      const isRoleValid = await EmailWhitelistService.validateRoleAssignment(email, role);
      if (!isRoleValid) {
        throw new Error(`Email ${email} is not authorized for ${role} role`);
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password, role, phone, address) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, role, phone || null, address || null]
      );

      // Get created user (without password)
      const [users] = await pool.execute(
        'SELECT id, name, email, role, phone, address, carbonCredits, totalRecycled, accountStatus, isVerified, createdAt FROM users WHERE id = ?',
        [result.insertId]
      );

      return users[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, role, phone, address, carbonCredits, totalRecycled, accountStatus, isVerified, createdAt FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Generate JWT token
  static generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  // Update user
  static async updateUser(id, updateData) {
    try {
      const allowedFields = ['name', 'phone', 'address', 'carbonCredits', 'totalRecycled', 'accountStatus', 'isVerified'];
      const updates = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          updates.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      values.push(id);
      const query = `UPDATE users SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
      
      await pool.execute(query, values);
      
      return await this.findById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Get all users with pagination
  static async getAllUsers(page = 1, limit = 10, role = null) {
    try {
      const offset = (page - 1) * limit;
      let query = 'SELECT id, name, email, role, phone, address, carbonCredits, totalRecycled, accountStatus, isVerified, createdAt FROM users';
      let countQuery = 'SELECT COUNT(*) as total FROM users';
      let params = [];

      if (role) {
        query += ' WHERE role = ?';
        countQuery += ' WHERE role = ?';
        params.push(role);
      }

      query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [users] = await pool.execute(query, params);
      const [countResult] = await pool.execute(countQuery, params.slice(0, -2));
      const total = countResult[0].total;

      return {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      };
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Get collectors
  static async getCollectors() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, phone, carbonCredits, totalRecycled, accountStatus FROM users WHERE role = "collector" AND accountStatus = "active" ORDER BY name'
      );
      return rows;
    } catch (error) {
      console.error('Error getting collectors:', error);
      return [];
    }
  }

  // Delete user
  static async deleteUser(id) {
    try {
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}

module.exports = UserService;


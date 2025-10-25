const { pool } = require('../config/database');

class EmailWhitelistService {
  // Check if email is whitelisted for admin or collector role
  static async isEmailWhitelisted(email, role) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM email_whitelist WHERE email = ? AND role = ? AND isActive = true',
        [email, role]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Error checking email whitelist:', error);
      return false;
    }
  }

  // Add email to whitelist
  static async addToWhitelist(email, role, addedBy = null) {
    try {
      await pool.execute(
        'INSERT INTO email_whitelist (email, role, addedBy) VALUES (?, ?, ?)',
        [email, role, addedBy]
      );
      return true;
    } catch (error) {
      console.error('Error adding to whitelist:', error);
      return false;
    }
  }

  // Remove email from whitelist (soft delete)
  static async removeFromWhitelist(email, role) {
    try {
      await pool.execute(
        'UPDATE email_whitelist SET isActive = false WHERE email = ? AND role = ?',
        [email, role]
      );
      return true;
    } catch (error) {
      console.error('Error removing from whitelist:', error);
      return false;
    }
  }

  // Get all whitelisted emails for a role
  static async getWhitelistedEmails(role = null) {
    try {
      let query = 'SELECT * FROM email_whitelist WHERE isActive = true';
      let params = [];
      
      if (role) {
        query += ' AND role = ?';
        params.push(role);
      }
      
      query += ' ORDER BY createdAt DESC';
      
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error getting whitelisted emails:', error);
      return [];
    }
  }

  // Validate role assignment during registration/login
  static async validateRoleAssignment(email, requestedRole) {
    // Regular users can always register
    if (requestedRole === 'user') {
      return true;
    }

    // Admin and collector roles require whitelist check
    if (requestedRole === 'admin' || requestedRole === 'collector') {
      return await this.isEmailWhitelisted(email, requestedRole);
    }

    return false;
  }
}

module.exports = EmailWhitelistService;


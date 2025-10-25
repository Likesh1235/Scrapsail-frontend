const { pool } = require('../config/database');

class PickupService {
  // Create a new pickup request
  static async createPickup(pickupData) {
    try {
      const { userId, wasteCategory, weight, pickupAddress, scheduledDate, coordinates } = pickupData;

      const [result] = await pool.execute(
        `INSERT INTO pickups (userId, wasteCategory, weight, pickupAddress, latitude, longitude, scheduledDate) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          wasteCategory,
          parseFloat(weight),
          pickupAddress,
          coordinates ? parseFloat(coordinates.latitude) : null,
          coordinates ? parseFloat(coordinates.longitude) : null,
          new Date(scheduledDate)
        ]
      );

      return await this.findById(result.insertId);
    } catch (error) {
      console.error('Error creating pickup:', error);
      throw error;
    }
  }

  // Find pickup by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, u.name as userName, u.email as userEmail, u.phone as userPhone,
                c.name as collectorName, c.email as collectorEmail, c.phone as collectorPhone
         FROM pickups p
         LEFT JOIN users u ON p.userId = u.id
         LEFT JOIN users c ON p.assignedCollectorId = c.id
         WHERE p.id = ?`,
        [id]
      );

      if (rows.length === 0) return null;

      const pickup = rows[0];
      return {
        _id: pickup.id,
        user: {
          _id: pickup.userId,
          name: pickup.userName,
          email: pickup.userEmail,
          phone: pickup.userPhone
        },
        wasteCategory: pickup.wasteCategory,
        weight: pickup.weight,
        pickupAddress: pickup.pickupAddress,
        coordinates: pickup.latitude && pickup.longitude ? {
          latitude: pickup.latitude,
          longitude: pickup.longitude
        } : null,
        scheduledDate: pickup.scheduledDate,
        status: pickup.status,
        assignedCollector: pickup.assignedCollectorId ? {
          _id: pickup.assignedCollectorId,
          name: pickup.collectorName,
          email: pickup.collectorEmail,
          phone: pickup.collectorPhone
        } : null,
        carbonCreditsEarned: pickup.carbonCreditsEarned,
        adminNotes: pickup.adminNotes,
        collectorNotes: pickup.collectorNotes,
        completionDate: pickup.completionDate,
        createdAt: pickup.createdAt,
        updatedAt: pickup.updatedAt
      };
    } catch (error) {
      console.error('Error finding pickup by ID:', error);
      return null;
    }
  }

  // Get user's pickups
  static async getUserPickups(userId, status = null, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT p.*, c.name as collectorName, c.email as collectorEmail, c.phone as collectorPhone
        FROM pickups p
        LEFT JOIN users c ON p.assignedCollectorId = c.id
        WHERE p.userId = ?
      `;
      let params = [userId];

      if (status) {
        query += ' AND p.status = ?';
        params.push(status);
      }

      query += ' ORDER BY p.createdAt DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [pickups] = await pool.execute(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM pickups WHERE userId = ?';
      let countParams = [userId];
      if (status) {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }

      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;

      return {
        pickups: pickups.map(pickup => ({
          _id: pickup.id,
          wasteCategory: pickup.wasteCategory,
          weight: pickup.weight,
          pickupAddress: pickup.pickupAddress,
          coordinates: pickup.latitude && pickup.longitude ? {
            latitude: pickup.latitude,
            longitude: pickup.longitude
          } : null,
          scheduledDate: pickup.scheduledDate,
          status: pickup.status,
          assignedCollector: pickup.assignedCollectorId ? {
            _id: pickup.assignedCollectorId,
            name: pickup.collectorName,
            email: pickup.collectorEmail,
            phone: pickup.collectorPhone
          } : null,
          carbonCreditsEarned: pickup.carbonCreditsEarned,
          adminNotes: pickup.adminNotes,
          collectorNotes: pickup.collectorNotes,
          completionDate: pickup.completionDate,
          createdAt: pickup.createdAt,
          updatedAt: pickup.updatedAt
        })),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      };
    } catch (error) {
      console.error('Error getting user pickups:', error);
      throw error;
    }
  }

  // Get pending pickups for admin
  static async getPendingPickups() {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, u.name as userName, u.email as userEmail, u.phone as userPhone
         FROM pickups p
         LEFT JOIN users u ON p.userId = u.id
         WHERE p.status = 'pending'
         ORDER BY p.createdAt ASC`
      );

      return rows.map(pickup => ({
        _id: pickup.id,
        user: {
          _id: pickup.userId,
          name: pickup.userName,
          email: pickup.userEmail,
          phone: pickup.userPhone
        },
        wasteCategory: pickup.wasteCategory,
        weight: pickup.weight,
        pickupAddress: pickup.pickupAddress,
        coordinates: pickup.latitude && pickup.longitude ? {
          latitude: pickup.latitude,
          longitude: pickup.longitude
        } : null,
        scheduledDate: pickup.scheduledDate,
        status: pickup.status,
        adminNotes: pickup.adminNotes,
        createdAt: pickup.createdAt,
        updatedAt: pickup.updatedAt
      }));
    } catch (error) {
      console.error('Error getting pending pickups:', error);
      return [];
    }
  }

  // Get assigned pickups for collector
  static async getAssignedPickups(collectorId) {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, u.name as userName, u.email as userEmail, u.phone as userPhone
         FROM pickups p
         LEFT JOIN users u ON p.userId = u.id
         WHERE p.assignedCollectorId = ? AND p.status IN ('collector-assigned', 'collector-accepted', 'in-progress')
         ORDER BY p.scheduledDate ASC`,
        [collectorId]
      );

      return rows.map(pickup => ({
        _id: pickup.id,
        user: {
          _id: pickup.userId,
          name: pickup.userName,
          email: pickup.userEmail,
          phone: pickup.userPhone
        },
        wasteCategory: pickup.wasteCategory,
        weight: pickup.weight,
        pickupAddress: pickup.pickupAddress,
        coordinates: pickup.latitude && pickup.longitude ? {
          latitude: pickup.latitude,
          longitude: pickup.longitude
        } : null,
        scheduledDate: pickup.scheduledDate,
        status: pickup.status,
        adminNotes: pickup.adminNotes,
        collectorNotes: pickup.collectorNotes,
        createdAt: pickup.createdAt,
        updatedAt: pickup.updatedAt
      }));
    } catch (error) {
      console.error('Error getting assigned pickups:', error);
      return [];
    }
  }

  // Update pickup status and auto-assign collector if approved
  static async updateStatus(id, status, notes = null, notesField = null) {
    try {
      let query = 'UPDATE pickups SET status = ?, updatedAt = CURRENT_TIMESTAMP';
      let params = [status];

      if (notes && notesField) {
        query += `, ${notesField} = ?`;
        params.push(notes);
      }

      query += ' WHERE id = ?';
      params.push(id);

      await pool.execute(query, params);

      // If status is admin-approved, auto-assign collector
      if (status === 'admin-approved') {
        await this.autoAssignCollector(id);
      }

      return await this.findById(id);
    } catch (error) {
      console.error('Error updating pickup status:', error);
      throw error;
    }
  }

  // Auto-assign collector to approved pickup
  static async autoAssignCollector(pickupId) {
    try {
      // Get first available collector (you can implement more sophisticated logic)
      const [collectors] = await pool.execute(
        'SELECT id FROM users WHERE role = "collector" AND accountStatus = "active" LIMIT 1'
      );

      if (collectors.length > 0) {
        const collectorId = collectors[0].id;
        await pool.execute(
          'UPDATE pickups SET assignedCollectorId = ?, status = "collector-assigned", updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
          [collectorId, pickupId]
        );
        console.log(`Auto-assigned collector ${collectorId} to pickup ${pickupId}`);
      } else {
        console.log('No available collectors found for auto-assignment');
      }
    } catch (error) {
      console.error('Error auto-assigning collector:', error);
    }
  }

  // Assign collector to pickup
  static async assignCollector(id, collectorId) {
    try {
      await pool.execute(
        'UPDATE pickups SET assignedCollectorId = ?, status = "collector-assigned", updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [collectorId, id]
      );
      return await this.findById(id);
    } catch (error) {
      console.error('Error assigning collector:', error);
      throw error;
    }
  }

  // Calculate carbon credits
  static calculateCarbonCredits(weight, wasteCategory) {
    const creditRates = {
      'Plastic': 10,
      'Metal': 15,
      'Paper': 8,
      'E-waste': 25,
      'Organic': 5,
      'Mixed': 12
    };
    
    return Math.round(weight * creditRates[wasteCategory]);
  }

  // Complete pickup
  static async completePickup(id) {
    try {
      const pickup = await this.findById(id);
      if (!pickup) throw new Error('Pickup not found');

      const carbonCredits = this.calculateCarbonCredits(pickup.weight, pickup.wasteCategory);

      await pool.execute(
        'UPDATE pickups SET status = "completed", carbonCreditsEarned = ?, completionDate = CURRENT_TIMESTAMP, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [carbonCredits, id]
      );

      // Update user's carbon credits
      await pool.execute(
        'UPDATE users SET carbonCredits = carbonCredits + ?, totalRecycled = totalRecycled + ? WHERE id = ?',
        [carbonCredits, pickup.weight, pickup.user._id]
      );

      return await this.findById(id);
    } catch (error) {
      console.error('Error completing pickup:', error);
      throw error;
    }
  }
}

module.exports = PickupService;


import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../../db.js';
import { authenticateToken } from './middleware/authmiddleware.js';
import { logAction } from '../../utils/logger.js';

const router = express.Router();

// Get all staff
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [staff] = await db.query(
      `SELECT su.username, su.official_role, b.branch_name, b.branch_id
       FROM Staff_User su 
       LEFT JOIN Branch b ON su.branch_id = b.branch_id 
       ORDER BY su.username`
    );
    res.json(staff);
  } catch (error) {
    console.error('Staff fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// Create staff
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { username, password, official_role, branch_id } = req.body;
    
    // Validate required fields
    if (!username || !password || !official_role || !branch_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username already exists
    const [existingStaff] = await db.query(
      'SELECT username FROM Staff_User WHERE username = ?',
      [username]
    );

    if (existingStaff.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new staff
    await db.query(
      'INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, official_role, branch_id]
    );

    await logAction(req.user.id, 'staff', username, 'create');
    res.json({ message: 'Staff member created successfully' });
  } catch (error) {
    console.error('Staff creation error:', error);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

// Update staff
router.put('/:username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    const { password, official_role, branch_id } = req.body;

    // Build update query based on what's provided
    const updates = [];
    const values = [];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (official_role) {
      updates.push('official_role = ?');
      values.push(official_role);
    }

    if (branch_id !== undefined) {
      updates.push('branch_id = ?');
      values.push(branch_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(username);

    await db.query(
      `UPDATE Staff_User SET ${updates.join(', ')} WHERE username = ?`,
      values
    );

    await logAction(req.user.id, 'staff', username, 'update');
    res.json({ message: 'Staff member updated successfully' });
  } catch (error) {
    console.error('Staff update error:', error);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

// Delete staff
router.delete('/:username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;

    // Prevent deleting yourself
    if (username === req.user.username) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await db.query('DELETE FROM Staff_User WHERE username = ?', [username]);
    await logAction(req.user.id, 'staff', username, 'delete');

    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Staff deletion error:', error);
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
});

// Get branches for dropdown
router.get('/branches', authenticateToken, async (req, res) => {
  try {
    const [branches] = await db.query('SELECT branch_id, branch_name FROM Branch ORDER BY branch_name');
    res.json(branches);
  } catch (error) {
    console.error('Branches fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

export default router;

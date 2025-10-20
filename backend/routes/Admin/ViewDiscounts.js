import express from 'express';
import db from '../../db.js';
import { authenticateToken } from './middleware/authmiddleware.js';

const router = express.Router();

// Get all discounts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [discounts] = await db.query(
      `SELECT d.*, b.branch_name, rt.type_name as room_type_name
       FROM Discount d 
       LEFT JOIN Branch b ON d.branch_id = b.branch_id
       LEFT JOIN RoomType rt ON d.room_type = rt.type_name
       ORDER BY d.discount_id`
    );
    res.json(discounts);
  } catch (error) {
    console.error('Discounts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch discounts' });
  }
});

// Get room types for dropdown
router.get('/room-types', authenticateToken, async (req, res) => {
  try {
    const [roomTypes] = await db.query('SELECT type_name FROM RoomType');
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room types' });
  }
});

export default router;

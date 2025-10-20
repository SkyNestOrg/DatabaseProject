import express from 'express';
import db from '../../db.js';
import { authenticateToken } from './middleware/authmiddleware.js';
import { logAction } from '../../utils/logger.js';

const router = express.Router();

// Create new discount
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { percentage, branch_id, room_type, start_date, end_date } = req.body;
    const [result] = await db.query(
      `INSERT INTO Discount (percentage, branch_id, room_type, start_date, end_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [percentage, branch_id, room_type, start_date, end_date]
    );
    await logAction(req.user.id, 'discount', result.insertId, 'create');
    res.json({ message: 'Discount created successfully', id: result.insertId });
  } catch (error) {
    console.error('Discount creation error:', error);
    res.status(500).json({ error: 'Failed to create discount' });
  }
});

// Update discount
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { percentage, branch_id, room_type, start_date, end_date } = req.body;
    await db.query(
      `UPDATE Discount 
       SET percentage = ?, branch_id = ?, room_type = ?, start_date = ?, end_date = ? 
       WHERE discount_id = ?`,
      [percentage, branch_id, room_type, start_date, end_date, req.params.id]
    );
    await logAction(req.user.id, 'discount', req.params.id, 'update');
    res.json({ message: 'Discount updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update discount' });
  }
});

// Delete discount
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM Discount WHERE discount_id = ?', [req.params.id]);
    await logAction(req.user.id, 'discount', req.params.id, 'delete');
    res.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete discount' });
  }
});

export default router;

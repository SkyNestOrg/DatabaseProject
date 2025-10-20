import express from 'express';
import db from '../../db.js';
import { authenticateToken } from './middleware/authmiddleware.js';

const router = express.Router();

// Get all tax revisions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [taxes] = await db.query(
      'SELECT * FROM Taxes_and_Charges ORDER BY revision_date DESC'
    );
    res.json(taxes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tax revisions' });
  }
});

// Get current tax rates
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const [currentTax] = await db.query(
      'SELECT * FROM Taxes_and_Charges ORDER BY revision_date DESC LIMIT 1'
    );
    res.json(currentTax[0] || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current tax rates' });
  }
});

export default router;

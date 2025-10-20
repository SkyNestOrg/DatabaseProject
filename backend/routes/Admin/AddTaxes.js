import express from 'express';
import db from '../../db.js';
import { authenticateToken } from './middleware/authmiddleware.js';
import { logAction } from '../../utils/logger.js';

const router = express.Router();

// Create new tax revision
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { revision_date, latest_tax_percentage, latest_surcharge_percentage } = req.body;
    
    await db.query(
      'INSERT INTO Taxes_and_Charges (revision_date, latest_tax_percentage, latest_surcharge_percentage) VALUES (?, ?, ?)',
      [revision_date, latest_tax_percentage, latest_surcharge_percentage]
    );

    await logAction(req.user.username, `Created tax revision: ${latest_tax_percentage}% tax, ${latest_surcharge_percentage}% surcharge`);
    res.json({ message: 'Tax revision created successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Tax revision for this date already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create tax revision' });
    }
  }
});

// Update tax revision
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { revision_date, latest_tax_percentage, latest_surcharge_percentage } = req.body;

    await db.query(
      'UPDATE Taxes_and_Charges SET revision_date = ?, latest_tax_percentage = ?, latest_surcharge_percentage = ? WHERE revision_id = ?',
      [revision_date, latest_tax_percentage, latest_surcharge_percentage, id]
    );

    await logAction(req.user.username, `Updated tax revision ID: ${id}`);
    res.json({ message: 'Tax revision updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tax revision' });
  }
});

// Delete tax revision
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('DELETE FROM Taxes_and_Charges WHERE revision_id = ?', [id]);
    await logAction(req.user.username, `Deleted tax revision ID: ${id}`);

    res.json({ message: 'Tax revision deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tax revision' });
  }
});

export default router;

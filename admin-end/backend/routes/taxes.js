const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get current tax rates
router.get('/current', async (req, res) => {
    try {
        const [taxes] = await db.execute(`
            SELECT * FROM Taxes_and_Charges 
            ORDER BY revision_date DESC 
            LIMIT 1
        `);
        res.json(taxes[0] || {});
    } catch (error) {
        console.error('Error fetching taxes:', error);
        res.status(500).json({ error: 'Failed to fetch tax rates' });
    }
});

// Get tax history
router.get('/history', async (req, res) => {
    try {
        const [history] = await db.execute(`
            SELECT * FROM Taxes_and_Charges 
            ORDER BY revision_date DESC
        `);
        res.json(history);
    } catch (error) {
        console.error('Error fetching tax history:', error);
        res.status(500).json({ error: 'Failed to fetch tax history' });
    }
});

// Update tax rates
router.post('/', async (req, res) => {
    const { latest_tax_percentage, latest_surcharge_percentage } = req.body;

    try {
        const today = new Date().toISOString().split('T')[0];
        
        await db.execute(
            'INSERT INTO Taxes_and_Charges (revision_date, latest_tax_percentage, latest_surcharge_percentage) VALUES (?, ?, ?)',
            [today, latest_tax_percentage, latest_surcharge_percentage]
        );

        res.json({ message: 'Tax rates updated successfully' });
    } catch (error) {
        console.error('Error updating taxes:', error);
        res.status(500).json({ error: 'Failed to update tax rates' });
    }
});

module.exports = router;
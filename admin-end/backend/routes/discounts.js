const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all discounts
router.get('/', async (req, res) => {
    try {
        const [discounts] = await db.execute(`
            SELECT d.*, b.branch_name, rt.type_name as room_type_name
            FROM Discount d
            LEFT JOIN Branch b ON d.branch_id = b.branch_id
            LEFT JOIN RoomType rt ON d.room_type = rt.type_name
            ORDER BY d.start_date DESC
        `);
        res.json(discounts);
    } catch (error) {
        console.error('Error fetching discounts:', error);
        res.status(500).json({ error: 'Failed to fetch discounts' });
    }
});

// Create new discount
router.post('/', async (req, res) => {
    const { percentage, branch_id, room_type, start_date, end_date } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO Discount (percentage, branch_id, room_type, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [percentage, branch_id, room_type, start_date, end_date]
        );

        res.status(201).json({
            message: 'Discount created successfully',
            discount_id: result.insertId
        });
    } catch (error) {
        console.error('Error creating discount:', error);
        res.status(500).json({ error: 'Failed to create discount' });
    }
});

// Update discount
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { percentage, branch_id, room_type, start_date, end_date } = req.body;

    try {
        await db.execute(
            'UPDATE Discount SET percentage = ?, branch_id = ?, room_type = ?, start_date = ?, end_date = ? WHERE discount_id = ?',
            [percentage, branch_id, room_type, start_date, end_date, id]
        );

        res.json({ message: 'Discount updated successfully' });
    } catch (error) {
        console.error('Error updating discount:', error);
        res.status(500).json({ error: 'Failed to update discount' });
    }
});

// Delete discount
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.execute('DELETE FROM Discount WHERE discount_id = ?', [id]);
        res.json({ message: 'Discount deleted successfully' });
    } catch (error) {
        console.error('Error deleting discount:', error);
        res.status(500).json({ error: 'Failed to delete discount' });
    }
});

module.exports = router;
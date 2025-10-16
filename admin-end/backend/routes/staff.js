const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();

// Get all staff members
router.get('/', async (req, res) => {
    try {
        const [staff] = await db.execute(`
            SELECT su.*, b.branch_name 
            FROM Staff_User su 
            LEFT JOIN Branch b ON su.branch_id = b.branch_id
            ORDER BY su.username
        `);
        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

// Create new staff member
router.post('/', async (req, res) => {
    const { username, password, official_role, branch_id } = req.body;

    try {
        // Check if username already exists
        const [existing] = await db.execute(
            'SELECT username FROM Staff_User WHERE username = ?',
            [username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert new staff
        const [result] = await db.execute(
            'INSERT INTO Staff_User (username, password, official_role, branch_id) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, official_role, branch_id]
        );

        // Log the action
        await db.execute(
            'INSERT INTO staff_logs (username, action) VALUES (?, ?)',
            [username, `Staff created: ${official_role}`]
        );

        res.status(201).json({
            message: 'Staff member created successfully',
            username,
            official_role,
            branch_id
        });

    } catch (error) {
        console.error('Error creating staff:', error);
        res.status(500).json({ error: 'Failed to create staff member' });
    }
});

// Update staff member - FIXED
router.put('/:username', async (req, res) => {
    const { username } = req.params;
    const { official_role, branch_id } = req.body;

    console.log('Updating staff:', username, official_role, branch_id); // Debug log

    try {
        // Check if staff exists
        const [existing] = await db.execute(
            'SELECT * FROM Staff_User WHERE username = ?',
            [username]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        // Update staff
        await db.execute(
            'UPDATE Staff_User SET official_role = ?, branch_id = ? WHERE username = ?',
            [official_role, branch_id, username]
        );

        // Log the action
        await db.execute(
            'INSERT INTO staff_logs (username, action) VALUES (?, ?)',
            [username, `Staff updated to: ${official_role}, branch: ${branch_id}`]
        );

        res.json({ 
            message: 'Staff member updated successfully',
            username,
            official_role,
            branch_id
        });
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).json({ error: 'Failed to update staff member: ' + error.message });
    }
});

// Delete staff member - FIXED
router.delete('/:username', async (req, res) => {
    const { username } = req.params;

    console.log('Deleting staff:', username); // Debug log

    try {
        // Check if staff exists
        const [existing] = await db.execute(
            'SELECT * FROM Staff_User WHERE username = ?',
            [username]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        // Prevent deleting yourself
        // You might want to get the current user from session/token in a real app
        // For now, we'll skip this check

        await db.execute('DELETE FROM Staff_User WHERE username = ?', [username]);

        // Log the action
        await db.execute(
            'INSERT INTO staff_logs (username, action) VALUES (?, ?)',
            [username, `Staff deleted: ${existing[0].official_role}`]
        );

        res.json({ message: 'Staff member deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        
        // Check if it's a foreign key constraint error
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(400).json({ 
                error: 'Cannot delete staff member. They have associated records in the system.' 
            });
        }
        
        res.status(500).json({ error: 'Failed to delete staff member: ' + error.message });
    }
});

// Get all branches (for dropdowns)
router.get('/branches', async (req, res) => {
    try {
        const [branches] = await db.execute('SELECT * FROM Branch ORDER BY branch_name');
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
});

// Get all room types (for dropdowns)
router.get('/room-types', async (req, res) => {
    try {
        const [roomTypes] = await db.execute('SELECT * FROM RoomType ORDER BY type_name');
        res.json(roomTypes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room types' });
    }
});

module.exports = router;
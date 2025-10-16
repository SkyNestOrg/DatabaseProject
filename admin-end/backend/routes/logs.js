const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get staff logs
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 50, username } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT * FROM staff_logs_detailed 
        `;
        let countQuery = `SELECT COUNT(*) as total FROM staff_logs_detailed`;
        const params = [];

        if (username) {
            query += ` WHERE username LIKE ?`;
            countQuery += ` WHERE username LIKE ?`;
            params.push(`%${username}%`);
        }

        query += ` ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), offset);

        const [logs] = await db.execute(query, params);
        const [[totalResult]] = await db.execute(countQuery, username ? [`%${username}%`] : []);

        res.json({
            logs,
            total: totalResult.total,
            page: parseInt(page),
            totalPages: Math.ceil(totalResult.total / limit)
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

module.exports = router;
import express from 'express';
import db from '../../db.js';
import { authenticateToken } from './middleware/authmiddleware.js';

const router = express.Router();

// Get system logs - FIXED parameter binding
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Parse and validate pagination inputs
    const pageRaw = req.query.page ?? 1;
    const limitRaw = req.query.limit ?? 50;
    const searchRaw = (req.query.search ?? '').toString();

  let pageNum = parseInt(String(pageRaw), 10);
  let limitNum = parseInt(String(limitRaw), 10);
    if (!Number.isFinite(pageNum) || pageNum < 1) pageNum = 1;
    if (!Number.isFinite(limitNum) || limitNum < 1) limitNum = 50;
    // Optional upper bound to prevent huge scans
    if (limitNum > 500) limitNum = 500;

    const offsetNum = (pageNum - 1) * limitNum;

    console.log('Fetching logs with params:', { page: pageNum, limit: limitNum, search: searchRaw, offset: offsetNum });

    let whereClause = '';
  const params = [];

    const search = searchRaw.trim();
    if (search) {
      whereClause = 'WHERE username LIKE ? OR action LIKE ? OR branch_name LIKE ? OR official_role LIKE ?';
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }

    // Count query
    const countQuery = whereClause
      ? `SELECT COUNT(*) as total FROM staff_logs_detailed ${whereClause}`
      : `SELECT COUNT(*) as total FROM staff_logs_detailed`;

    const [countRows] = await db.query(countQuery, params);
    const total = (countRows[0] && countRows[0].total) ? Number(countRows[0].total) : 0;

    // Data query: interpolate validated integers for LIMIT/OFFSET; keep text params bound
    const dataQuery = `
      SELECT *
      FROM staff_logs_detailed
      ${whereClause}
      ORDER BY \`timestamp\` DESC
      LIMIT ${limitNum} OFFSET ${offsetNum}
    `;

    console.log('Executing data query:', dataQuery.trim());
    console.log('With parameters:', params);

    const [logs] = await db.query(dataQuery, params);

    console.log(`Found ${logs.length} logs out of ${total} total`);

    res.json({
      logs,
      total,
      page: pageNum,
      totalPages: limitNum ? Math.ceil(total / limitNum) : 0
    });
  } catch (error) {
    console.error('Logs fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch logs: ' + error.message });
  }
});

export default router;

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
router.use(express.json());

// Provide a helpful response for GET requests so browsers or simple curl GETs don't show "Cannot GET /stafflogin"
router.get('/', (req, res) => {
  return res.status(405).json({ success: false, status: 'Method Not Allowed. Use POST /stafflogin to login.' });
});

// POST /stafflogin
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, status: 'Username and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM staff_user WHERE username = ?', [username]);
    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, status: 'Invalid credentials' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, status: 'Invalid credentials' });
    }

    // Normalize role from database field
    const rawRole = (user.official_role || user.role || '').toString().toLowerCase();
    let role = 'staff';
    if (rawRole.includes('admin')) role = 'admin';
    else if (rawRole.includes('management') || rawRole.includes('manager')) role = 'management';
    else if (rawRole.includes('front')) role = 'frontdesk';

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ username: user.username, role }, secret, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      status: 'Login successful',
      token,
      user: {
        username: user.username,
        role,
      }
    });
  } catch (err) {
    console.error('StaffLogin error:', err);
    res.status(500).json({ success: false, status: 'Server error during login', error: err.message });
  }
});

export default router;

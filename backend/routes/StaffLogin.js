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

// POST /stafflogin (unified - handles staff and guest)
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, status: 'Username and password are required' });
  }

  try {
    // Try staff table first
    const [staffRows] = await db.query('SELECT * FROM Staff_User WHERE username = ?', [username]);

    if (staffRows && staffRows.length > 0) {
      const user = staffRows[0];
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
      else if (rawRole.includes('service')) role = 'serviceoffice';

      const secret = process.env.JWT_SECRET || 'dev-secret-key';
      const token = jwt.sign(
        {
          username: user.username,
          role,
          branch_id: user.branch_id,
          staff_id: user.staff_id,
        },
        secret,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        status: 'Login successful',
        token,
        user: {
          username: user.username,
          role,
        }
      });
    }

    // If not found in staff_user, check guest_user
    const [guestRows] = await db.query('SELECT * FROM guest_user WHERE username = ?', [username]);
    if (!guestRows || guestRows.length === 0) {
      return res.status(401).json({ success: false, status: 'Invalid credentials' });
    }

    const guest = guestRows[0];
    const guestPasswordValid = await bcrypt.compare(password, guest.password);
    if (!guestPasswordValid) {
      return res.status(401).json({ success: false, status: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret-key';
    const token = jwt.sign({ userId: guest.guest_id, username: guest.username, role: 'guest' }, secret, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      status: 'Login successful',
      token,
      user: {
        id: guest.guest_id,
        username: guest.username,
        role: 'guest'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, status: 'Server error during login', error: err.message });
  }
});

export default router;

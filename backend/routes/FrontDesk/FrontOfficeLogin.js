import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../db.js';

const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'mysecretkey'; // Consistent naming

// Helper function for login logic
async function handleLogin(user, userType, res, password) {
  try {
    // Compare the provided password with the hashed password
    // const isMatch = await bcrypt.compare(password, user.password);

    // if (!isMatch) {
    //   return res.status(401).json({ error: 'Incorrect password' });
    // }

    if (password !== user.password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const payload = {
      username: user.username,
      role: user.official_role || 'guest', // Default to 'guest' if not staff
      branch_id: user.branch_name || null,
      guest_id: user.guest_id || null,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

    let redirectUrl = '/';
    if (userType === 'guest') redirectUrl = '/guest-dashboard';
    else if (userType === 'staff') {
      if (user.official_role === 'receptionist') redirectUrl = '/reception-dashboard';
      else if (user.official_role === 'admin') redirectUrl = '/admin-dashboard';
      else redirectUrl = '/staff-dashboard';
    }

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        role: user.official_role || 'guest',
        branch: user.branch_name || null,
        name: user.first_name ? `${user.first_name} ${user.last_name}` : user.username,
      },
      redirectUrl,
    });
  } catch (err) {
    console.error('Password comparison error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check Guest
    const [guestRows] = await db.query(
      `SELECT gu.username, gu.password, g.guest_id, g.first_name, g.last_name, 
              g.email, g.phone_number, 'guest' AS official_role
       FROM Guest_User gu
       JOIN Guest g ON gu.guest_id = g.guest_id
       WHERE gu.username = ?`,
      [username]
    );

    if (guestRows.length > 0) {
      return handleLogin(guestRows[0], 'guest', res, password);
    }

    // Check Staff
    const [staffRows] = await db.query(
      `SELECT su.username, su.password, su.official_role, su.branch_id,
              b.branch_name, b.city
       FROM Staff_User su
       JOIN Branch b ON su.branch_id = b.branch_id
       WHERE su.username = ?`,
      [username]
    );

    if (staffRows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return handleLogin(staffRows[0], 'staff', res, password);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
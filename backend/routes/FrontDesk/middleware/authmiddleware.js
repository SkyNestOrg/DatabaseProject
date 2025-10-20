import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const secretkey = process.env.JWT_SECRET;

const router = express.Router();

export const authenticateToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, secretkey, (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err.message);
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    req.user = decoded; // decoded contains username, role, branch, etc.
    next();
  });
};

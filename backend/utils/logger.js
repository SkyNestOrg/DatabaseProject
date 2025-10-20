import db from '../db.js';

export const logAction = async (username, action) => {
  try {
    await db.query(
      'INSERT INTO staff_logs (username, action) VALUES (?, ?)',
      [username, action]
    );
  } catch (error) {
    console.error('Logging error:', error);
  }
};
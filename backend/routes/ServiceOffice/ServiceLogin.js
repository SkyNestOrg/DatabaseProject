import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // For generating authentication tokens
import db from "../../db.js";
import { USER_ROLES } from "./serviceOfficeConstants/constants.js";

// POST /login
export const login = async (req, res) => {
  console.log("POST /servicelogin received:", req.body);

  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      status: "Username and password are required",
      success: false,
    });
  }

  try {
    // Check if user exists
    const [rows] = await db.query(
      "SELECT * FROM staff_user WHERE username = ? AND official_role = ?",
      [username, USER_ROLES.SERVICEOFFICE]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        status: "Invalid credentials",
        success: false,
      });
    }

    const user = rows[0];

    // Compare password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "Invalid credentials",
        success: false,
      });
    }
    const secretkey = process.env.JWT_SECRET;
    // Generate JWT token
    const token = jwt.sign(
      {
        username: user.username,
        role: user.official_role, // Use actual role from database
        branch_id: user.branch_id,
      },
      //process.env.JWT_SECRET || 'your-secret-key',
      secretkey, // SAME KEY IN BOTH FILES

      { expiresIn: "1h" }
    );

    console.log("Login successful for user:", username);

    res.status(200).json({
      status: "Login successful",
      success: true,
      token: token,
      user: {
        username: user.username, // Make sure this is the correct field name
        role: user.official_role, // Use actual role from database
        branch_id: user.branch_id,
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      status: "Server error during login",
      success: false,
      error: err.message,
    });
  }
};

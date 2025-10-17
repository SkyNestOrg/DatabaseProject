// middleware/authMiddleware.js
<<<<<<< HEAD
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
=======
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
>>>>>>> 58656561f727e7a33d3ef3bdd1835b96a184635c
dotenv.config();

const secretkey = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  // Check for token in multiple headers
<<<<<<< HEAD
  let token = req.headers["x-access-token"];

  // If not found in x-access-token, check Authorization header
  if (!token) {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token not provided",
=======
  let token = req.headers['x-access-token'];
  
  // If not found in x-access-token, check Authorization header
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }
 
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token not provided'
>>>>>>> 58656561f727e7a33d3ef3bdd1835b96a184635c
    });
  }

  jwt.verify(token, secretkey, (err, decoded) => {
    if (err) {
<<<<<<< HEAD
      console.error("Token verification error:", err.message); // Add logging
      return res.status(403).json({
        success: false,
        message: "Failed to authenticate token",
      });
    }

    req.user = {
      username: decoded.username,
      role: decoded.role,
      branch_id: decoded.branch_id, // Fixed: use branch_id consistently
    };
    // branch: decoded.branch (copilot generated)   -> was there before 'branch_id: decoded.branch_id'
    next();
  });
};
=======
      console.error('Token verification error:', err.message); // Add logging
      return res.status(403).json({
        success: false,
        message: 'Failed to authenticate token'
      });
    }
   
    req.user = {
      username: decoded.username,
      role: decoded.role,
      branch: decoded.branch
    };
   
    next();
  });
};
>>>>>>> 58656561f727e7a33d3ef3bdd1835b96a184635c

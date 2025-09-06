const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const secretkey = process.env.SECRET_KEY;

router.use(cookieParser());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }
    
    jwt.verify(token, secretkey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired'
                });
            }
            return res.status(403).json({
                success: false,
                message: 'Invalid token'
            });
        }
        req.user = decoded;
        next();
    });
};

// Protected route
router.get('/', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token authenticated',
        username: req.user.username
    });
});

module.exports = router;
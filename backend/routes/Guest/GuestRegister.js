// import express from 'express';
// import bcrypt from 'bcrypt';
// import db from '../../db.js';

// const router = express.Router();
// router.use(express.json());

// // Function to generate random guest_id
// function generateGuestId() {
//     // Generate random 6-digit number (100000 to 999999)
//     return Math.floor(100000 + Math.random() * 900000);
// }

// // Function to check if guest_id already exists
// function checkGuestIdExists(guestId, callback) {
//     const sqlCheckId = 'SELECT * FROM guest_user WHERE guest_id = ?';
//     db.query(sqlCheckId, [guestId], (err, result) => {
//         if (err) return callback(err, null);
//         callback(null, result.length > 0);
//     });
// }

// // Function to generate unique guest_id
// function generateUniqueGuestId(callback) {
//     let attempts = 0;
//     const maxAttempts = 10;
    
//     function tryGenerate() {
//         if (attempts >= maxAttempts) {
//             return callback(new Error('Failed to generate unique guest_id after multiple attempts'), null);
//         }
        
//         const guestId = generateGuestId();
//         attempts++;
        
//         checkGuestIdExists(guestId, (err, exists) => {
//             if (err) return callback(err, null);
//             if (exists) {
//                 tryGenerate(); // Try again if ID exists
//             } else {
//                 callback(null, guestId); // Return unique ID
//             }
//         });
//     }
    
//     tryGenerate();
// }



// router.post('/', async (req, res) => {
   
//     console.log('POST /register received:', req.body);
//     console.log('Headers:', req.headers);
//     // ... rest of your code

//     const { username, password, confirmPassword } = req.body;

//     // Check if all required fields are provided
//     if (!username || !password || !confirmPassword) {
//         return res.status(400).json({
//             status: 'Please provide username, password, and confirmPassword',
//             success: false
//         });
//     }

//     // Check if password and confirmPassword match
//     if (password !== confirmPassword) {
//         return res.status(400).json({
//             status: 'Password and confirmPassword do not match',
//             success: false
//         });
//     }

//     // Validate password strength
//     if (password.length < 6) {
//         return res.status(400).json({
//             status: 'Password must be at least 6 characters long',
//             success: false
//         });
//     }

//     try {
//         // Check if the username already exists
//         const sqlCheck = 'SELECT * FROM guest_user WHERE username = ?';
//         db.query(sqlCheck, [username], (err, result) => {
//              console.log("DB check result:", err, result);
//             if (err) {
//                 console.error('Database check error:', err);
//                 return res.status(500).json({
//                     status: 'Server side error',
//                     success: false,
//                     error: err.message
//                 });
//             }
            
//             if (result.length > 0) {
//                 return res.status(409).json({
//                     status: 'Username already exists',
//                     success: false
//                 });
//             }

//             // Generate unique guest_id
//             generateUniqueGuestId((err, guestId) => {
//                 if (err) {
//                     console.error('Guest ID generation error:', err);
//                     return res.status(500).json({
//                         status: 'Error generating unique ID',
//                         success: false,
//                         error: err.message
//                     });
//                 }

//                 // Hash the password
//                 bcrypt.hash(password, 10, (err, hashedPassword) => {
//                     if (err) {
//                         console.error('Password hash error:', err);
//                         return res.status(500).json({
//                             status: 'Error in hashing password',
//                             success: false,
//                             error: err.message
//                         });
//                     }

//                     // Insert new guest into the database
//                     const sqlInsert = 'INSERT INTO guest_user (guest_id, username, password) VALUES (?, ?, ?)';
//                     db.query(sqlInsert, [guestId, username, hashedPassword], (err, result) => {
//                         console.log("Insert result:", err, result); // 👈 log this
//                         if (err) {
//                             console.error('Database insert error:', err);
//                             return res.status(500).json({
//                                 status: 'Server side error',
//                                 success: false,
//                                 error: err.message
//                             });
//                         }
                        
//                         console.log('Registration successful. Guest ID:', guestId);
//                         res.status(201).json({
//                             status: 'Guest registered successfully!',
//                             success: true,
//                             guestId: guestId,
//                             username: username
//                         });
//                     });
//                 });
//             });
//         });
//     } catch (err) {
//         console.error('Unexpected error:', err);
//         res.status(500).json({
//             status: 'Server side error',
//             success: false,
//             error: err.message
//         });
//     }
// });

// export default router;

import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';

const router = express.Router();
router.use(express.json());

// Function to generate random 6-digit guest_id
function generateGuestId() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Function to ensure guest_id is unique in Guest_User
function generateUniqueGuestId(callback) {
    const maxAttempts = 10;
    let attempts = 0;

    function tryGenerate() {
        if (attempts >= maxAttempts) {
            return callback(new Error('Failed to generate unique guest_id after multiple attempts'), null);
        }
        attempts++;
        const guestId = generateGuestId();
        const sqlCheck = 'SELECT * FROM Guest_User WHERE guest_id = ?';
        db.query(sqlCheck, [guestId], (err, result) => {
            if (err) return callback(err, null);
            if (result.length > 0) {
                tryGenerate(); // already exists, try again
            } else {
                callback(null, guestId); // unique guest_id
            }
        });
    }

    tryGenerate();
}

router.post('/', (req, res) => {
    console.log('POST /register received:', req.body);
    const { username, password, confirmPassword } = req.body;

    // Validate input
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ status: 'Please provide username, password, and confirmPassword', success: false });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ status: 'Password and confirmPassword do not match', success: false });
    }
    if (password.length < 6) {
        return res.status(400).json({ status: 'Password must be at least 6 characters long', success: false });
    }

    // Check if username exists
    const sqlCheckUser = 'SELECT * FROM Guest_User WHERE username = ?';
    db.query(sqlCheckUser, [username], (err, result) => {
        if (err) return res.status(500).json({ status: 'Database error', success: false, error: err.message });
        if (result.length > 0) return res.status(409).json({ status: 'Username already exists', success: false });

        // Generate unique guest_id
        generateUniqueGuestId((err, guestId) => {
            if (err) return res.status(500).json({ status: 'Error generating unique guest_id', success: false, error: err.message });

            // Hash password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) return res.status(500).json({ status: 'Error hashing password', success: false, error: err.message });

                // Insert new user
                const sqlInsert = 'INSERT INTO Guest_User (username, password, guest_id) VALUES (?, ?, ?)';
                db.query(sqlInsert, [username, hashedPassword, guestId], (err, result) => {
                    if (err) return res.status(500).json({ status: 'Database insert error', success: false, error: err.message });

                    console.log('Registration successful:', username, guestId);
                    res.status(201).json({ status: 'Guest registered successfully!', success: true, username, guestId });
                });
            });
        });
    });
});

export default router;

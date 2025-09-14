import bcrypt from 'bcrypt';
import db from '../db/connection.js';
import jwt from 'jsonwebtoken';

//****** only the login controller has been used in here *******/


// signup controller
export const signup = async (req, res) => {
    try {
    // get data from req.body
    const { username, email, password } = req.body;
    // validate that none are empty
    if (!username || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }
    // check if user already exists
    const [existing] = await db.query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [email, username]
    );
    if (existing.length > 0) {
        return res.status(400).json({message: "User already exists"});
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert the new user into the database
    const [result] = await db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
    );
    
    const token = jwt.sign(
        { id: result.insertId, email: email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(201).json({message: "User created successfully", token});
    }
    catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

// nested callbacks can be messy as routes grow
// we can use promises or async/await to avoid nested callbacks
// but for now this is fine, as we have only two queries


// login controller
export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        // validating that none are empty
        if (!username || !password) return res.status(400).json({message: "All fields are required"});

        const [users] = await db.query (
            "SELECT * FROM staff_user WHERE username = ?",
            [username]
        );
        if (users.length === 0) return res.status(400).json({message: "Invalid credentials"});

        const user = users[0];
        // passwword is hashed, so we need to compare
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({message: "Login successful", token});
    } 
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

//get profile method without jwt
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [results] = await db.query (
            "SELECT id, username, email, created_at FROM users WHERE id = ?",
            [userId]
        );

        if (results.length === 0) return res.status(404).json({message: "User Not Found"});

        const user = results[0];
        res.status(200).json({user});
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

// password updater without jwt or session verifications
export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({message: "All fields are required"});
        }
        const [users] = await db.query (
            "SELECT * FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) return res.status(404).json({message: "User not found"});

        const user = users[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) return res.status(400).json({message: "Old password is incorrect"});

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query (
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, userId]
        );
        res.status(200).json({message: "Password updated successfully"});
    }
    catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

// Delete user without jwt
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const [result] = await db.query (
            "DELETE FROM users WHERE id = ?",
            [userId]
        );

        if (result.affectedRows === 0) return res.status(404).json({message: "User not found"});

        res.status(200).json({message: "User deleted successfully"});
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({message: "Internal server error"});
    }
};
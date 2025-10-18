// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import db from "../../db.js";

// const router = express.Router();
// const secretKey = process.env.JWT_SECRET || "mysecretkey"; // Consistent naming

// // Helper function for login logic
// async function handleLogin(user, userType, res, password) {
//   try {
//     console.log("handleLogin called with user:", user, "userType:", userType, "password:", password);

//     // Compare the provided password with the hashed password
//     console.log("Comparing password for user:", user.username);
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("Password match result:", isMatch);

//     if (!isMatch) {
//       console.log("Password mismatch for user:", user.username);
//       return res.status(401).json({ error: "Incorrect password" });
//     }

//     const payload = {
//       username: user.username,
//       role: user.official_role || "guest", // Default to 'guest' if not staff
//       branch_id: userType === "staff" ? user.branch_id : null, // Use branch_id for staff, null for guests
//       guest_id: user.guest_id || null,
//     };
//     console.log("Generated payload:", payload);

//     const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
//     console.log("Generated token:", token);

//     // Determine redirect URL based on user type and role
//     let redirectUrl = "/";
//     if (userType === "guest") redirectUrl = "/guest-dashboard";
//     else if (userType === "staff") {
//       if (user.official_role === "receptionist") redirectUrl = "/reception-dashboard";
//       else if (user.official_role === "admin") redirectUrl = "/admin-dashboard";
//       else redirectUrl = "/staff-dashboard";
//     }
//     console.log("Determined redirectUrl:", redirectUrl);

//     const response = {
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         username: user.username,
//         role: user.official_role || "guest",
//         branch: user.branch_id || null,
//         name: user.first_name ? `${user.first_name} ${user.last_name}` : user.username,
//       },
//       redirectUrl,
//     };
//     console.log("Sending response:", response);

//     res.json(response);
//   } catch (err) {
//     console.error("Password comparison error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// router.post("/", async (req, res) => {
//   try {
//     console.log("Received login request with body:", req.body);

//     const { username, password } = req.body;
//     if (!username || !password) {
//       console.log("Missing username or password:", { username, password });
//       return res.status(400).json({ error: "Username and password are required" });
//     }

//     console.log("Attempting to find guest with username:", username);
//     // Check Guest
//     const [guestRows] = await db.query(
//       `SELECT gu.username, gu.password, g.guest_id, g.first_name, g.last_name, 
//               g.email, g.phone_number, 'guest' AS official_role
//        FROM Guest_User gu
//        JOIN Guest g ON gu.guest_id = g.guest_id
//        WHERE gu.username = ?`,
//       [username]
//     );
//     console.log("Guest query result:", guestRows);

//     if (guestRows.length > 0) {
//       console.log("Found guest user:", guestRows[0]);
//       return handleLogin(guestRows[0], "guest", res, password);
//     }

//     console.log("Attempting to find staff with username:", username);
//     // Check Staff
//     const [staffRows] = await db.query(
//       `SELECT su.username, su.password, su.official_role, su.branch_id,
//               b.branch_name, b.city
//        FROM Staff_User su
//        JOIN Branch b ON su.branch_id = b.branch_id
//        WHERE su.username = ?`,
//       [username]
//     );
//     console.log("Staff query result:", staffRows);

//     if (staffRows.length === 0) {
//       console.log("No user found for username:", username);
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     console.log("Found staff user:", staffRows[0]);
//     return handleLogin(staffRows[0], "staff", res, password);
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.get("/test", (req, res) => {
//   res.json({ message: "Front Office Login route is working!" });
// });

// export default router;

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../db.js";

const router = express.Router();
const secretKey = process.env.JWT_SECRET || "mysecretkey"; // Consistent naming

console.log("🚀 FrontDeskLogin module loaded");
console.log("Database object type:", typeof db);
console.log("Database object keys:", Object.keys(db || {}));

// Helper function for login logic
async function handleLogin(user, userType, res, password) {
  try {
    console.log("handleLogin called with user:", user, "userType:", userType, "password:", password);

    // Compare the provided password with the hashed password
    console.log("Comparing password for user:", user.username);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for user:", user.username);
      return res.status(401).json({ error: "Incorrect password" });
    }

    const payload = {
      username: user.username,
      role: user.official_role || "guest", // Default to 'guest' if not staff
      branch_id: userType === "staff" ? user.branch_id : null, // Use branch_id for staff, null for guests
      guest_id: user.guest_id || null,
    };
    console.log("Generated payload:", payload);

    const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
    console.log("Generated token:", token);

    // Determine redirect URL based on user type and role
    let redirectUrl = "/";
    if (userType === "guest") redirectUrl = "/guest-dashboard";
    else if (userType === "staff") {
      if (user.official_role === "receptionist") redirectUrl = "/reception-dashboard";
      else if (user.official_role === "admin") redirectUrl = "/admin-dashboard";
      else redirectUrl = "/staff-dashboard";
    }
    console.log("Determined redirectUrl:", redirectUrl);

    const response = {
      success: true,
      message: "Login successful",
      token,
      user: {
        username: user.username,
        role: user.official_role || "guest",
        branch: user.branch_id || null,
        name: user.first_name ? `${user.first_name} ${user.last_name}` : user.username,
      },
      redirectUrl,
    };
    console.log("Sending response:", response);

    res.json(response);
  } catch (err) {
    console.error("Password comparison error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

router.post("/", async (req, res) => {
  try {
    console.log("=== LOGIN REQUEST STARTED ===");
    console.log("Received login request with body:", req.body);

    const { username, password } = req.body;
    if (!username || !password) {
      console.log("❌ Missing username or password:", { username, password });
      return res.status(400).json({ error: "Username and password are required" });
    }

    console.log("🔍 Attempting to find staff with username:", username);
    try {
      // Check Staff only
      const [staffRows] = await db.query(
        `SELECT su.username, su.password, su.official_role, su.branch_id,
                b.branch_name, b.city
         FROM Staff_User su
         JOIN Branch b ON su.branch_id = b.branch_id
         WHERE su.username = ?`,
        [username]
      );
      console.log("✅ Staff query completed. Results:", staffRows?.length || 0);

      if (staffRows && staffRows.length === 0) {
        console.log("❌ No staff user found for username:", username);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (staffRows && staffRows.length > 0) {
        console.log("👤 Found staff user:", staffRows[0].username);
        return await handleLogin(staffRows[0], "staff", res, password);
      }
    } catch (staffErr) {
      console.error("❌ Staff query error:", staffErr.message);
      return res.status(500).json({ error: "Database error: " + staffErr.message });
    }

    console.log("=== LOGIN REQUEST ENDED ===");
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "Front Office Login route is working!" });
});

router.get("/testdb", async (req, res) => {
  try {
    console.log("🧪 Testing database connection...");
    const result = await db.query("SELECT 1 as test");
    console.log("✅ Database connection successful!");
    res.json({ success: true, message: "Database connected", result });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    res.status(500).json({ success: false, error: "Database error: " + err.message });
  }
});

export default router;
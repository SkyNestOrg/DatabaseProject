// ================== Imports ==================
import express from 'express';           // Express framework
import db from '../../db.js';              // MySQL library for DB interaction
import bcrypt from 'bcrypt';             // Password hashing
import session from 'express-session';   // Session management
import path from 'path';                 // File path handling
import cors from 'cors';                 // CORS middleware
import { Guest, Branch, Booking, Room, Service, Payment } from './FrontDeskClasses.js'; // your classes

const app = express();
const PORT = process.env.PORT || 3000;


// ================= Middleware =================
app.use(express.json());                      // Parse incoming JSON requests. Eg : If a client sends {"username": "yohan"}, Express will turn it into req.body.username
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests. Eg : If a client sends username=yohan, Express will turn it into req.body.username
app.use(express.static('public'));            // Serve static files from 'public' directory. Eg : If you have a file public/index.html, it can be accessed at http://localhost:3000/index.html
app.use(cors());                              // Enable CORS for all routes. Eg : Allows frontend running on a different port to access this backend

// ============== DB Connection ================
// ============== DB Connection ================
// const db = mysql.createPool({
//   host: process.env.DB_HOST || "127.0.0.1",        // DB host from environment or default
//   port: process.env.DB_PORT || "3306",        // DB host from environment or default
//   user: process.env.DB_USER || "root",            // DB user from environment or default
//   password: process.env.DB_PASSWORD || "rootpassword",     // DB password from environment or default
//   database: process.env.DB_NAME || "project",   // DB name from environment or default
// });

// =========== Session Configuration ===========
app.use(session({
    secret: 'hotel-management-secret-key',      // Secret key for signing the session ID cookie
    resave: false,                             // Don't save session if unmodified
    saveUninitialized: false,                  // Don't create session until something stored
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// let db;

// async function initializeDB() {
//     try {
//         db = await mysql.createConnection(dbConfig);
//         console.log('Connected to MySQL database');
//     } catch (error) {
//         console.error('Database connection failed:', error);
//         process.exit(1);
//     }
// }

// Authentication middleware
const requireAuth = (req, res, next) => {
  // Check if user is authenticated. This is a placeholder; implement actual auth logic. Eg : Check if req.session.user exists

    if (!req.session.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

const requireRole = (roles) => {
  // Middleware to check if user has one of the required roles. Eg : If a route requires 'admin' role, check if req.session.user.role === 'admin'


    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.official_role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

// ================== Routes ===================

// 1. Login Route.........................................................................................


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    let user = null;
    let userType = null;

    //  Check Guest_User table
    db.query(`
        SELECT gu.username, gu.password, g.guest_id, g.first_name, g.last_name, 
               g.email, g.phone_number, 'guest' AS official_role
        FROM Guest_User gu
        JOIN Guest g ON gu.guest_id = g.guest_id
        WHERE gu.username = ?
    `, [username], (err, guestRows) => {

        if (err) {
            console.error('Database error (guest):', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (guestRows.length > 0) {
            user = guestRows[0];
            userType = 'guest';
            
            handleLogin();
        } 
        
        else {
            //  Check Staff_User table
            db.query(`
                SELECT su.username, su.password, su.official_role, su.branch_id,
                       b.branch_name, b.city
                FROM Staff_User su
                JOIN Branch b ON su.branch_id = b.branch_id
                WHERE su.username = ?
            `, [username], (err, staffRows) => {

                if (err) {
                    console.error('Database error (staff):', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (staffRows.length > 0) {
                    user = staffRows[0];
                    userType = 'staff';
                    handleLogin();
                } 
                else {
                    // User not found
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
            });
        }
    });

    // Function to handle login after user is found
    function handleLogin() {
        // Verify password securely
        // bcrypt.compare(password, user.password, (err, match) => {
        //     if (err) {
        //         console.error('Bcrypt error:', err);
        //         return res.status(500).json({ error: 'Server error' });
        //     }

        //     if (!match) {
        //         return res.status(401).json({ error: 'Incorrect Password' });
        //     }

        // Basic sanity checks
        if (!user || typeof user.password === 'undefined') {
            console.error('User record missing or missing password for', username);
            return res.status(500).json({ error: 'Server error' });
        }

        // Direct password comparison (NOT SECURE for production)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Incorrect Password' });
        }

        console.log(`${userType} ${username} logged in successfully`);

        // Set session
        req.session.user = {
            username: user.username,
            official_role: user.official_role,
            branch_id: user.branch_id,
            guest_id: user.guest_id,
            name: user.first_name ? `${user.first_name} ${user.last_name}` : user.username,
            branch_name: user.branch_name
        };

        // Log staff login
        if (userType === 'staff') {
            db.query(
                `INSERT INTO staff_logs (username, action) VALUES (?, ?)`,
                [username, 'Login'],
                (err) => {
                    if (err) console.error('Error inserting staff log:', err);
                    else console.log('Staff login logged successfully');
                }
            );
        }

        // Redirect frontend based on role
        let redirectUrl = '/';
        if (userType === 'guest') redirectUrl = '/guest-dashboard.html';
        else if (userType === 'staff') {
            if (user.official_role === 'receptionist') redirectUrl = '/reception-dashboard.html';
            else if (user.official_role === 'admin') redirectUrl = '/admin-dashboard.html';
            else redirectUrl = '/staff-dashboard.html';
        }

        return res.json({
            success: true,
            user: req.session.user,
            redirectUrl
        });
    }
});
//......................................................................................................

// 2. Dashboard summary
app.get("/dashboard", (req, res) => {
  
  db.query("SELECT COUNT(*) AS totalGuests FROM Guests", (err, guests) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query("SELECT COUNT(*) AS totalBookings FROM Bookings", (err, bookings) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query("SELECT COUNT(*) AS activeBookings FROM Bookings WHERE status = 'checked-in'", (err, active) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          totalGuests: guests[0].totalGuests,
          totalBookings: bookings[0].totalBookings,
          activeBookings: active[0].activeBookings,
        });
      });
    });
  });
});


// 3. Checkin
app.post("/checkin/:bookingId", (req, res) => {
  const bookingId = req.params.bookingId;

  db.query(
    "UPDATE Booking SET status = 'checked-in' WHERE booking_id = ?",
    [bookingId],
    (err, result) => {
      if (err) {
        console.error("DB update error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      console.log("Booking ID updated:", bookingId);
      console.log("Params:", req.params);

      res.json({ success: true, message: "Guest checked in" });
    }
  );
});


//.........................................................................................

//4. Checkout
app.post("/checkout/:bookingId", async (req, res) => {

  const bookingId = req.params.bookingId;


  db.query("UPDATE Booking SET status = 'checked-out' WHERE booking_id = ?", [bookingId],
    (error, results) => {
      if (error) {
        console.error("DB update error:", error);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      console.log("Booking ID updated:", bookingId);
      console.log("Params:", req.params);

      res.json({ success: true, message: "Guest checked out" });
    }
  );
  
});

// 5. Create Booking
app.post("/booking", async (req, res) => {
  const { guestId, roomNumber, checkinDate, checkoutDate, bill } = req.body;
  const [result] = await db.query(
    "INSERT INTO Bookings (guestId, roomNumber, checkinDate, checkoutDate, status, bill) VALUES (?, ?, ?, ?, 'booked', ?)",
    [guestId, roomNumber, checkinDate, checkoutDate, bill]
  );
  res.json({ success: true, bookingId: result.insertId });
});

// 6. Cancel Booking
app.post("/cancel/:bookingId", async (req, res) => {

  const bookingId = req.params.bookingId;

  db.query("UPDATE Booking SET status = 'cancelled' WHERE booking_id = ?", [bookingId],
  (error, results) => {
    if (error) {
      console.error("DB update error:", error);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    console.log("Booking ID updated:", bookingId);
    console.log("Params:", req.params);
    
  }
);
res.json({ success: true, message: "Booking cancelled" });  
});

// 7. Payment Processing
app.post("/makePayment/:bookingId", (req, res) => {
  const bookingId = req.params.bookingId;
  const { payment_method, paid_amount } = req.body;

  // Step 1: Find bill_id using booking_id
  db.query("SELECT bill_id FROM Booking WHERE booking_id = ?", [bookingId], (err, result) => {
    if (err) {
      console.error("Error fetching bill ID:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const billId = result[0].bill_id;

    // Step 2: Insert into Payment table
    db.query(
      "INSERT INTO Payment (bill_id, payment_method, paid_amount, payment_date) VALUES (?, ?, ?, NOW())",
      [billId, payment_method, paid_amount],
      (err2, result2) => {
        if (err2) {
          console.error("Error cancelling payment:", err2);
          return res.status(500).json({ success: false, message: "Database error" });
        }

        console.log("Payment cancelled successfully for booking:", bookingId);
        res.json({ success: true, message: "Payment cancelled successfully" });
      }
    );
  });
});

///....................................................................................................................

//cancel payment ---> Gnereate the code which we can cancel the payement of the recent payemnt like undo it
app.post("/cancelPayment/:bookingId", (req, res) => {
  const bookingId = req.params.bookingId;

  // Step 1: Find the bill_id for the booking
  db.query("SELECT bill_id FROM Booking WHERE booking_id = ?", [bookingId], (err, result) => {
    if (err) {
      console.error("Error fetching bill ID:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const billId = result[0].bill_id;

    // Step 2: Delete only the most recent payment
    const deleteQuery = `
      DELETE FROM Payment 
      WHERE payment_reference = (
        SELECT payment_reference FROM (
          SELECT payment_reference 
          FROM Payment 
          WHERE bill_id = ? 
          ORDER BY payment_date DESC 
          LIMIT 1
        ) AS temp
      )
    `;

    db.query(deleteQuery, [billId], (err2, result2) => {
      if (err2) {
        console.error("Error deleting latest payment:", err2);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (result2.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "No recent payment found to delete" });
      }

      console.log("Most recent payment deleted for booking:", bookingId);
      res.json({ success: true, message: "Most recent payment deleted successfully" });
    });
  });
});



// 8. View Bills
app.get("/bills/:bookingId", (req, res) => {
  const bookingId = req.params.bookingId;

  // 1. Guest Details
  db.query("CALL ViewGuestDetails(?)", [bookingId], (err, guestResult) => {
    if (err) {
      console.error("Error fetching guest details:", err);
      return res.status(500).json({ error: "Database error (guest details)" });
    }

    const guestData = guestResult[0][0]; // ✅ Correct access
    if (!guestData) return res.status(404).json({ error: "Booking not found" });
    const guest = new Guest(guestData);

    // 2. Branch Details
    db.query("CALL ViewBranchDetails(?)", [bookingId], (err, branchResult) => {
      if (err) {
        console.error("Error fetching branch details:", err);
        return res.status(500).json({ error: "Database error (branch details)" });
      }

      const branchData = branchResult[0][0]; // ✅ Correct access
      const branch = new Branch(branchData);

      // 3. Booking Details
      db.query("CALL ViewBookingDetails(?)", [bookingId], (err, bookingResult) => {
        if (err) {
          console.error("Error fetching booking details:", err);
          return res.status(500).json({ error: "Database error (booking details)" });
        }

        const bookingData = bookingResult[0][0]; // ✅ Correct access
        const booking = new Booking(bookingData);

        // 4. Room Charges
        db.query("CALL ViewRoomCharges(?)", [bookingId], (err, roomResult) => {
          if (err) {
            console.error("Error fetching room charges:", err);
            return res.status(500).json({ error: "Database error (room charges)" });
          }

          const rooms = roomResult[0].map(room => new Room(room)); // ✅ Correct access

          // 5. Service Charges
          db.query("CALL ViewServiceCharges(?)", [bookingId], (err, serviceResult) => {
            if (err) {
              console.error("Error fetching service charges:", err);
              return res.status(500).json({ error: "Database error (service charges)" });
            }

            const services = serviceResult[0].map(s => new Service(s)); // ✅ Correct access

            // 6. Payment + Summary
            db.query("CALL ViewPaymentAndSummary(?)", [bookingId], (err, paymentResult) => {
              if (err) {
                console.error("Error fetching payments:", err);
                return res.status(500).json({ error: "Database error (payments)" });
              }

              // ⚠️ This procedure has TWO SELECT statements
              // First result: payments
              // Second result: summary
              const paymentsData = paymentResult[0]; // first SELECT
              const summaryData = paymentResult[1][0]; // second SELECT (one row)

              const payments = paymentsData.map(p => new Payment(p));
              const summary = new Payment(summaryData);

              // ✅ Combine all data
              const billDetails = {
                guest,
                branch,
                booking,
                rooms,
                services,
                payments,
                summary
              };

              console.log("✅ Bill details fetched successfully");
              res.json(billDetails);
            });
          });
        });
      });
    });
  });
});



// ============== Start Server ==================
app.listen(5000, () => console.log("🚀 Server running on port 5000"));

// // ================== Imports ==================
// import express from 'express';
// import db from '../../db.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import cors from 'cors';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;
// const secretkey = process.env.JWT_SECRET;

// // ================= Middleware =================
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use(cors());

// // ================= Authentication Middleware =================

// // ================== Routes ===================



// // ================== Protected Example ===================
// app.get('/api/profile', authenticateToken, (req, res) => {
//   res.json({
//     message: `Welcome, ${req.user.username}`,
//     role: req.user.role,
//     branch: req.user.branch,
//   });
// });



// //......................................................................................................

// app.get('/is_authenticated', (req,res) => {
//   authenticateToken(req,res, () => {
//     res.json({ authenticated: true, user: req.user });
//   });
// });

// // 2. Dashboard summary. Return no of guests bookings and currently active bookings
// app.get("/dashboard", (req, res) => {
//   authenticateToken(req,res, () => {
//     db.query("SELECT COUNT(*) AS totalGuests FROM Guests", (err, guests) => {
//     if (err) return res.status(500).json({ error: err.message });

//     db.query("SELECT COUNT(*) AS totalBookings FROM Bookings", (err, bookings) => {
//       if (err) return res.status(500).json({ error: err.message });

//       db.query("SELECT COUNT(*) AS activeBookings FROM Bookings WHERE status = 'checked-in'", (err, active) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.json({
//           totalGuests: guests[0].totalGuests,
//           totalBookings: bookings[0].totalBookings,
//           activeBookings: active[0].activeBookings,
//         });
//       });
//     });
//   });
//   });
// });


// // 3. Checkin
// // app.post("/checkin/:bookingId", (req, res) => {
// //   const bookingId = req.params.bookingId;

// //   db.query(
// //     "UPDATE Booking SET status = 'checked-in' WHERE booking_id = ?",
// //     [bookingId],
// //     (err, result) => {
// //       if (err) {
// //         console.error("DB update error:", err);
// //         return res.status(500).json({ success: false, message: "Database error" });
// //       }

// //       if (result.affectedRows === 0) {
// //         return res.status(404).json({ success: false, message: "Booking not found" });
// //       }

// //       console.log("Booking ID updated:", bookingId);
// //       console.log("Params:", req.params);

// //       res.json({ success: true, message: "Guest checked in" });
// //     }
// //   );
// // });


// //.........................................................................................

// //4. Checkout
// // app.post("/checkout/:bookingId", async (req, res) => {

// //   const bookingId = req.params.bookingId;


// //   db.query("UPDATE Booking SET status = 'checked-out' WHERE booking_id = ?", [bookingId],
// //     (error, results) => {
// //       if (error) {
// //         console.error("DB update error:", error);
// //         return res.status(500).json({ success: false, message: "Database error" });
// //       }

// //       if (results.affectedRows === 0) {
// //         return res.status(404).json({ success: false, message: "Booking not found" });
// //       }

// //       console.log("Booking ID updated:", bookingId);
// //       console.log("Params:", req.params);

// //       res.json({ success: true, message: "Guest checked out" });
// //     }
// //   );
  
// // });

// // // 5. Create Booking
// // app.post("/booking", async (req, res) => {
// //   const { guestId, roomNumber, checkinDate, checkoutDate, bill } = req.body;
// //   const [result] = await db.query(
// //     "INSERT INTO Bookings (guestId, roomNumber, checkinDate, checkoutDate, status, bill) VALUES (?, ?, ?, ?, 'booked', ?)",
// //     [guestId, roomNumber, checkinDate, checkoutDate, bill]
// //   );
// //   res.json({ success: true, bookingId: result.insertId });
// // });

// // // 6. Cancel Booking
// // app.post("/cancel/:bookingId", async (req, res) => {

// //   const bookingId = req.params.bookingId;

// //   db.query("UPDATE Booking SET status = 'cancelled' WHERE booking_id = ?", [bookingId],
// //   (error, results) => {
// //     if (error) {
// //       console.error("DB update error:", error);
// //       return res.status(500).json({ success: false, message: "Database error" });
// //     }

// //     if (results.affectedRows === 0) {
// //       return res.status(404).json({ success: false, message: "Booking not found" });
// //     }

// //     console.log("Booking ID updated:", bookingId);
// //     console.log("Params:", req.params);
    
// //   }
// // );
// // res.json({ success: true, message: "Booking cancelled" });  
// // });

// // 7. Payment Processing
// app.post("/makePayment/:bookingId", (req, res) => {
//   const bookingId = req.params.bookingId;
//   const { payment_method, paid_amount } = req.body;

//   // Step 1: Find bill_id using booking_id
//   db.query("SELECT bill_id FROM Booking WHERE booking_id = ?", [bookingId], (err, result) => {
//     if (err) {
//       console.error("Error fetching bill ID:", err);
//       return res.status(500).json({ success: false, message: "Database error" });
//     }

//     if (result.length === 0) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     const billId = result[0].bill_id;

//     // Step 2: Insert into Payment table
//     db.query(
//       "INSERT INTO Payment (bill_id, payment_method, paid_amount, payment_date) VALUES (?, ?, ?, NOW())",
//       [billId, payment_method, paid_amount],
//       (err2, result2) => {
//         if (err2) {
//           console.error("Error cancelling payment:", err2);
//           return res.status(500).json({ success: false, message: "Database error" });
//         }

//         console.log("Payment cancelled successfully for booking:", bookingId);
//         res.json({ success: true, message: "Payment cancelled successfully" });
//       }
//     );
//   });
// });

// ///....................................................................................................................

// //cancel payment ---> Gnereate the code which we can cancel the payement of the recent payemnt like undo it
// app.post("/cancelPayment/:bookingId", (req, res) => {
//   const bookingId = req.params.bookingId;

//   // Step 1: Find the bill_id for the booking
//   db.query("SELECT bill_id FROM Booking WHERE booking_id = ?", [bookingId], (err, result) => {
//     if (err) {
//       console.error("Error fetching bill ID:", err);
//       return res.status(500).json({ success: false, message: "Database error" });
//     }

//     if (result.length === 0) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     const billId = result[0].bill_id;

//     // Step 2: Delete only the most recent payment
//     const deleteQuery = `
//       DELETE FROM Payment 
//       WHERE payment_reference = (
//         SELECT payment_reference FROM (
//           SELECT payment_reference 
//           FROM Payment 
//           WHERE bill_id = ? 
//           ORDER BY payment_date DESC 
//           LIMIT 1
//         ) AS temp
//       )
//     `;

//     db.query(deleteQuery, [billId], (err2, result2) => {
//       if (err2) {
//         console.error("Error deleting latest payment:", err2);
//         return res.status(500).json({ success: false, message: "Database error" });
//       }

//       if (result2.affectedRows === 0) {
//         return res.status(404).json({ success: false, message: "No recent payment found to delete" });
//       }

//       console.log("Most recent payment deleted for booking:", bookingId);
//       res.json({ success: true, message: "Most recent payment deleted successfully" });
//     });
//   });
// });



// // 8. View Bills
// app.get("/bills/:bookingId", (req, res) => {
//   const bookingId = req.params.bookingId;

//   // 1. Guest Details
//   db.query("CALL ViewGuestDetails(?)", [bookingId], (err, guestResult) => {
//     if (err) {
//       console.error("Error fetching guest details:", err);
//       return res.status(500).json({ error: "Database error (guest details)" });
//     }

//     const guestData = guestResult[0][0]; // ✅ Correct access
//     if (!guestData) return res.status(404).json({ error: "Booking not found" });
//     const guest = new Guest(guestData);

//     // 2. Branch Details
//     db.query("CALL ViewBranchDetails(?)", [bookingId], (err, branchResult) => {
//       if (err) {
//         console.error("Error fetching branch details:", err);
//         return res.status(500).json({ error: "Database error (branch details)" });
//       }

//       const branchData = branchResult[0][0]; // ✅ Correct access
//       const branch = new Branch(branchData);

//       // 3. Booking Details
//       db.query("CALL ViewBookingDetails(?)", [bookingId], (err, bookingResult) => {
//         if (err) {
//           console.error("Error fetching booking details:", err);
//           return res.status(500).json({ error: "Database error (booking details)" });
//         }

//         const bookingData = bookingResult[0][0]; // ✅ Correct access
//         const booking = new Booking(bookingData);

//         // 4. Room Charges
//         db.query("CALL ViewRoomCharges(?)", [bookingId], (err, roomResult) => {
//           if (err) {
//             console.error("Error fetching room charges:", err);
//             return res.status(500).json({ error: "Database error (room charges)" });
//           }

//           const rooms = roomResult[0].map(room => new Room(room)); // ✅ Correct access

//           // 5. Service Charges
//           db.query("CALL ViewServiceCharges(?)", [bookingId], (err, serviceResult) => {
//             if (err) {
//               console.error("Error fetching service charges:", err);
//               return res.status(500).json({ error: "Database error (service charges)" });
//             }

//             const services = serviceResult[0].map(s => new Service(s)); // ✅ Correct access

//             // 6. Payment + Summary
//             db.query("CALL ViewPaymentAndSummary(?)", [bookingId], (err, paymentResult) => {
//               if (err) {
//                 console.error("Error fetching payments:", err);
//                 return res.status(500).json({ error: "Database error (payments)" });
//               }

//               // ⚠️ This procedure has TWO SELECT statements
//               // First result: payments
//               // Second result: summary
//               const paymentsData = paymentResult[0]; // first SELECT
//               const summaryData = paymentResult[1][0]; // second SELECT (one row)

//               const payments = paymentsData.map(p => new Payment(p));
//               const summary = new Payment(summaryData);

//               // ✅ Combine all data
//               const billDetails = {
//                 guest,
//                 branch,
//                 booking,
//                 rooms,
//                 services,
//                 payments,
//                 summary
//               };

//               console.log("✅ Bill details fetched successfully");
//               res.json(billDetails);
//             });
//           });
//         });
//       });
//     });
//   });
// });



// // ============== Start Server ==================
// app.listen(5000, () => console.log("🚀 Server running on port 5000"));

// import express from "express";
// import db from "../../db.js";
// import authenticateToken from "../../middleware/authenticateToken.js";
// import { Guest, Branch, Booking, Room, Service, Payment } from "./FrontDeskClasses.js";

// const router = express.Router();


// router.post("/:bookingId", authenticateToken, async (req, res) => {
//   const bookingId = req.params.bookingId;
//   const { payment_method, paid_amount } = req.body;

//   try {
//     // Find bill_id using booking_id
//     const [bookingResult] = await db.query(
//       "SELECT bill_id FROM Bookings WHERE booking_id = ?",
//       [bookingId]
//     );

//     if (bookingResult.length === 0) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     const billId = bookingResult[0].bill_id;

//     // Insert payment
//     const [paymentResult] = await db.query(
//       "INSERT INTO Payment (bill_id, payment_method, paid_amount, payment_date) VALUES (?, ?, ?, NOW())",
//       [billId, payment_method, paid_amount]
//     );

//     console.log("Payment added for booking:", bookingId);
//     console.log("Added by:", req.user?.username || "Unknown");

//     res.json({ success: true, message: "Payment added successfully" });
//   } catch (error) {
//     console.error("Error processing payment:", error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });



//  //Cancel Most Recent Payment (Undo Latest Payment)
 
// router.post("/:bookingId", authenticateToken, async (req, res) => {
//   const bookingId = req.params.bookingId;

//   try {
//     // Step 1: Find the bill_id for the booking
//     const [bookingResult] = await db.query(
//       "SELECT bill_id FROM Bookings WHERE booking_id = ?",
//       [bookingId]
//     );

//     if (bookingResult.length === 0) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     const billId = bookingResult[0].bill_id;

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

//     const [deleteResult] = await db.query(deleteQuery, [billId]);

//     if (deleteResult.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No recent payment found to delete",
//       });
//     }

//     console.log("✅ Most recent payment deleted for booking:", bookingId);
//     console.log("🧑 Cancelled by:", req.user?.username || "Unknown");

//     res.json({ success: true, message: "Most recent payment deleted successfully" });
//   } catch (error) {
//     console.error("❌ Error cancelling payment:", error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });


//  //View Bill Details

// router.get("/bills/:bookingId", authenticateToken, async (req, res) => {
//   const bookingId = req.params.bookingId;

//   try {
//     //  Guest Details
//     const [guestResult] = await db.query("CALL ViewGuestDetails(?)", [bookingId]);
//     const guestData = guestResult[0][0];
//     if (!guestData) return res.status(404).json({ error: "Booking not found" });
//     const guest = new Guest(guestData);

//     //  Branch Details
//     const [branchResult] = await db.query("CALL ViewBranchDetails(?)", [bookingId]);
//     const branchData = branchResult[0][0];
//     const branch = new Branch(branchData);

//     // Booking Details
//     const [bookingResult] = await db.query("CALL ViewBookingDetails(?)", [bookingId]);
//     const bookingData = bookingResult[0][0];
//     const booking = new Booking(bookingData);

//     //  Room Charges
//     const [roomResult] = await db.query("CALL ViewRoomCharges(?)", [bookingId]);
//     const rooms = roomResult[0].map((r) => new Room(r));

//     //  Service Charges
//     const [serviceResult] = await db.query("CALL ViewServiceCharges(?)", [bookingId]);
//     const services = serviceResult[0].map((s) => new Service(s));

//     //  Payment + Summary
//     const [paymentResult] = await db.query("CALL ViewPaymentAndSummary(?)", [bookingId]);
//     const paymentsData = paymentResult[0];
//     const summaryData = paymentResult[1][0];

//     const payments = paymentsData.map((p) => new Payment(p));
//     const summary = new Payment(summaryData);

//     //  Combine all data
//     const billDetails = {
//       guest,
//       branch,
//       booking,
//       rooms,
//       services,
//       payments,
//       summary,
//     };

//     console.log("✅ Bill details fetched successfully by:", req.user?.username || "Unknown");
//     res.json(billDetails);
//   } catch (error) {
//     console.error("❌ Error fetching bill details:", error);
//     res.status(500).json({ error: "Database error while fetching bill details" });
//   }
// });

// export default router;

import express from "express";
import db from "../../db.js";
import { authenticateToken } from "./middleware/authmiddleware.js";
import { Guest, Branch, Booking, Room, Service, Payment } from "./FrontDeskClasses.js";

const router = express.Router();

// Add Payment
router.post("/:bookingId", authenticateToken, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { payment_method, paid_amount } = req.body;

  try {
    // Find bill_id using booking_id
    const [bookingResult] = await db.query(
      "SELECT bill_id FROM Bookings WHERE booking_id = ?",
      [bookingId]
    );

    if (bookingResult.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const billId = bookingResult[0].bill_id;

    // Insert payment
    const [paymentResult] = await db.query(
      "INSERT INTO Payment (bill_id, payment_method, paid_amount, payment_date) VALUES (?, ?, ?, NOW())",
      [billId, payment_method, paid_amount]
    );

    console.log("Payment added for booking:", bookingId);
    console.log("Added by:", req.user?.username || "Unknown");

    res.json({ success: true, message: "Payment added successfully" });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Cancel Most Recent Payment
router.post("/:bookingId/cancel", authenticateToken, async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    // Step 1: Find the bill_id for the booking
    const [bookingResult] = await db.query(
      "SELECT bill_id FROM Bookings WHERE booking_id = ?",
      [bookingId]
    );

    if (bookingResult.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const billId = bookingResult[0].bill_id;

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

    const [deleteResult] = await db.query(deleteQuery, [billId]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "No recent payment found to delete",
      });
    }

    console.log("✅ Most recent payment deleted for booking:", bookingId);
    console.log("🧑 Cancelled by:", req.user?.username || "Unknown");

    res.json({ success: true, message: "Most recent payment deleted successfully" });
  } catch (error) {
    console.error("❌ Error cancelling payment:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// View Bill Details
router.get("/bills/:bookingId", authenticateToken, async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    // Guest Details
    const [guestResult] = await db.query("CALL ViewGuestDetails(?)", [bookingId]);
    const guestData = guestResult[0][0];
    if (!guestData) return res.status(404).json({ error: "Booking not found" });
    const guest = new Guest(guestData);

    // Branch Details
    const [branchResult] = await db.query("CALL ViewBranchDetails(?)", [bookingId]);
    const branchData = branchResult[0][0];
    const branch = new Branch(branchData);

    // Booking Details
    const [bookingResult] = await db.query("CALL ViewBookingDetails(?)", [bookingId]);
    const bookingData = bookingResult[0][0];
    const booking = new Booking(bookingData);

    // Room Charges
    const [roomResult] = await db.query("CALL ViewRoomCharges(?)", [bookingId]);
    const rooms = roomResult[0].map((r) => new Room(r));

    // Service Charges
    const [serviceResult] = await db.query("CALL ViewServiceCharges(?)", [bookingId]);
    const services = serviceResult[0].map((s) => new Service(s));

    // Payment + Summary
    const [paymentResult] = await db.query("CALL ViewPaymentAndSummary(?)", [bookingId]);
    const paymentsData = paymentResult[0];
    const summaryData = paymentResult[1][0];

    const payments = paymentsData.map((p) => new Payment(p));
    const summary = new Payment(summaryData);

    // Combine all data
    const billDetails = {
      guest,
      branch,
      booking,
      rooms,
      services,
      payments,
      summary,
    };

    console.log("✅ Bill details fetched successfully by:", req.user?.username || "Unknown");
    res.json(billDetails);
  } catch (error) {
    console.error("❌ Error fetching bill details:", error);
    res.status(500).json({ error: "Database error while fetching bill details" });
  }
});

export default router;
// import express from "express";
// import db from "../../db.js";
// import { authenticateToken } from "./middleware/authmiddleware.js";


// const router = express.Router();

// // Add Payment.........................................................................................................
// router.post("/add/:bookingId", authenticateToken, async (req, res) => {
  
//   const bookingId = req.params.bookingId;
//   const {payment_method, paid_amount } = req.body;

//   if (!bookingId) {
//     return res.status(400).json({ 
//       success: false, 
//       message: "bookingId is required in the request body." 
//     });
//   }
//   try {
//     // Validate input
//     if (!payment_method || !paid_amount || paid_amount <= 0) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Invalid payment details. payment_method and paid_amount are required and paid_amount must be greater than 0." 
//       });
//     }

//     // Find booking and bill details
//     const [bookingResult] = await db.query(
//       `SELECT b.booking_id, bi.bill_id, bi.due_amount 
//        FROM Booking b 
//        JOIN Bill bi ON b.booking_id = bi.booking_id 
//        WHERE b.booking_id = ? AND bi.bill_status = 'Pending'`,
//       [bookingId]
//     );

//     if (bookingResult.length === 0) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Booking not found or bill is not pending" 
//       });
//     }

//     const { bill_id, due_amount } = bookingResult[0];

//     // Check if payment exceeds due amount
//     if (paid_amount > due_amount) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Payment amount (${paid_amount}) exceeds due amount (${due_amount})` 
//       });
//     }
    
    


//     // Start transaction to ensure data consistency
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Insert payment record
//       const [paymentResult] = await connection.query(
//         "INSERT INTO Payment (bill_id, payment_method, paid_amount, payment_date) VALUES (?, ?, ?, NOW())",
//         [bill_id, payment_method, paid_amount]
//       );

//       // Update bill due_amount
//       const [updateResult] = await connection.query(
//         "UPDATE Bill SET due_amount = due_amount - ? WHERE bill_id = ?",
//         [paid_amount, bill_id]
//       );

//       // Get updated bill status (trigger will handle this automatically)
//       const [updatedBill] = await connection.query(
//         "SELECT bill_status, due_amount FROM Bill WHERE bill_id = ?",
//         [bill_id]
//       );

//       await connection.commit();

//       console.log("Payment added for booking:", bookingId);
//       console.log("Payment amount:", paid_amount);
//       console.log("New due amount:", updatedBill[0].due_amount);
//       console.log("New bill status:", updatedBill[0].bill_status);
//       console.log("Added by:", req.user?.username || "Unknown");

//       // Return success response with updated bill information
//       res.json({ 
//         success: true, 
//         message: "Payment added successfully",
//         data: {
//           payment_id: paymentResult.insertId,
//           booking_id: bookingId,
//           bill_id: bill_id,
//           paid_amount: paid_amount,
//           remaining_due: updatedBill[0].due_amount,
//           bill_status: updatedBill[0].bill_status,
//           payment_method: payment_method
//         }
//       });

//     } catch (transactionError) {
//       await connection.rollback();
//       throw transactionError;
//     } finally {
//       connection.release();
//     }

//   } catch (error) {
//     console.error("Error processing payment:", error);
    
//     // Handle specific errors
//     if (error.code === 'ER_NO_REFERENCED_ROW_2') {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Bill not found for this booking" 
//       });
//     }
    
//     res.status(500).json({ 
//       success: false, 
//       message: "Database error occurred while processing payment" 
//     });
//   }
// });

// //cancel the recent booking .............................................................................

// router.post("/cancel/:bookingId", authenticateToken, async (req, res) => {
//   const bookingId = req.params.bookingId;

//   if(!bookingId){
//     return  res.status(400).json({ success: false, message: "bookingId is required in the request body." });
//   }

//   console.log("Booking ID to cancel payment for:", bookingId);

//   let connection;
//   try {
//     connection = await db.getConnection();
//     await connection.beginTransaction();

//     // Step 1: Find the bill_id for the booking
//     const [bookingResult] = await connection.query(
//       "SELECT bill_id FROM Bill WHERE booking_id = ?",
//       [bookingId]
//     );

//     if (bookingResult.length === 0) {
//       await connection.rollback();
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     const billId = bookingResult[0].bill_id;

//     // Step 2: Get current bill details
//     const [billResult] = await connection.query(
//       "SELECT room_total, service_total, tax_amount, due_amount FROM Bill WHERE bill_id = ?",
//       [billId]
//     );

//     if (billResult.length === 0) {
//       await connection.rollback();
//       return res.status(404).json({ success: false, message: "Bill not found" });
//     }

//     const { room_total, service_total, tax_amount } = billResult[0];

// // default null/undefined to 0
//     const safeRoomTotal = Number(room_total) || 0;
//     const safeServiceTotal = Number(service_total) || 0;
//     const safeTaxAmount = Number(tax_amount) || 0;

//     const originalTotal = safeRoomTotal + safeServiceTotal + safeTaxAmount;

//     // Step 3: Delete only the most recent payment
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

//     const [deleteResult] = await connection.query(deleteQuery, [billId]);

//     if (deleteResult.affectedRows === 0) {
//       await connection.rollback();
//       return res.status(404).json({
//         success: false,
//         message: "No recent payment found to delete",
//       });
//     }

//     // Step 4: Recalculate due_amount
//     const [paymentSumResult] = await connection.query(
//       "SELECT COALESCE(SUM(paid_amount), 0) AS total_paid FROM Payment WHERE bill_id = ?",
//       [billId]
//     );

//     const totalPaid = paymentSumResult[0].total_paid;
//     const newDueAmount = originalTotal - totalPaid;

//     // Step 5: Update Bill with new due_amount
//     await connection.query(
//       "UPDATE Bill SET due_amount = ? WHERE bill_id = ?",
//       [newDueAmount, billId]
//     );

//     // Step 6: Update bill_status if fully paid
//     const newStatus = newDueAmount <= 0 ? "Paid" : "Pending";
//     await connection.query(
//       "UPDATE Bill SET bill_status = ? WHERE bill_id = ?",
//       [newStatus, billId]
//     );

//     await connection.commit();

//     console.log("✅ Most recent payment deleted for booking:", bookingId);
//     console.log("🧑 Cancelled by:", req.user?.username || "Unknown");

//     res.json({ success: true, message: "Most recent payment deleted successfully", new_due_amount: newDueAmount });
//   } catch (error) {
//     if (connection) await connection.rollback();
//     console.error("❌ Error cancelling payment:", error);
//     res.status(500).json({ success: false, message: "Database error" });
//   } finally {
//     if (connection) connection.release();
//   }
// });

// // View Bill Details............................................................................................  

// router.get("/bills/:bookingId", authenticateToken, async (req, res) => {
//   const bookingId = req.params.bookingId;

//   try {
//     // Guest Details
//     const [guestResult] = await db.query("CALL ViewGuestDetails(?)", [bookingId]);
//     if (guestResult[0].length === 0) return res.status(404).json({ error: "Booking not found" });

//     // Branch Details
//     const [branchResult] = await db.query("CALL ViewBranchDetails(?)", [bookingId]);

//     // Booking Details
//     const [bookingResult] = await db.query("CALL ViewBookingDetails(?)", [bookingId]);

//     // Room Charges
//     const [roomResult] = await db.query("CALL ViewRoomCharges(?)", [bookingId]);

//     // Service Charges
//     const [serviceResult] = await db.query("CALL ViewServiceCharges(?)", [bookingId]);

//     // Payment + Summary
//     const [paymentResult] = await db.query("CALL ViewPaymentAndSummary(?)", [bookingId]);
//     const paymentsData = paymentResult[0];
//     const summaryData = paymentResult[1][0] || {};

//     // Return raw data as an array of results
//     const billDetails = {
//       guest: guestResult[0][0],
//       branch: branchResult[0][0] || {},
//       booking: bookingResult[0][0] || {},
//       rooms: roomResult[0],
//       services: serviceResult[0],
//       payments: paymentsData,
//       summary: summaryData,
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

const router = express.Router();

// Add Payment.........................................................................................................
router.post("/add/:bookingId", authenticateToken, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { payment_method, paid_amount } = req.body;

  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: "bookingId is required in the request body."
    });
  }

  try {
    // Validate input
    if (!payment_method || !paid_amount || paid_amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment details. payment_method and paid_amount are required and paid_amount must be greater than 0."
      });
    }

    // Find booking and bill details (only pending bills)
    const [bookingResult] = await db.query(
      `SELECT b.booking_id, bi.bill_id, bi.due_amount 
       FROM Booking b 
       JOIN Bill bi ON b.booking_id = bi.booking_id 
       WHERE b.booking_id = ? AND bi.bill_status = 'Pending'`,
      [bookingId]
    );

    if (bookingResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or bill is not pending"
      });
    }

    const { bill_id, due_amount } = bookingResult[0];

    // Check if payment exceeds due amount
    if (paid_amount > due_amount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount (${paid_amount}) exceeds due amount (${due_amount})`
      });
    }

    // Start transaction to ensure data consistency
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert payment record ONLY — triggers will update Bill table
      const [paymentResult] = await connection.query(
        "INSERT INTO Payment (bill_id, payment_method, paid_amount, payment_date) VALUES (?, ?, ?, NOW())",
        [bill_id, payment_method, paid_amount]
      );

      // Commit so DB trigger can run and finalize bill updates
      await connection.commit();

      // After commit, read the updated bill (triggers are expected to have updated due_amount and bill_status)
      const [updatedBill] = await db.query(
        "SELECT bill_status, due_amount FROM Bill WHERE bill_id = ?",
        [bill_id]
      );

      console.log("Payment added for booking:", bookingId);
      console.log("Payment amount:", paid_amount);
      console.log("New due amount:", updatedBill[0]?.due_amount);
      console.log("New bill status:", updatedBill[0]?.bill_status);
      console.log("Added by:", req.user?.username || "Unknown");

      // Return success response with updated bill information
      res.json({
        success: true,
        message: "Payment added successfully",
        data: {
          payment_id: paymentResult.insertId,
          booking_id: bookingId,
          bill_id: bill_id,
          paid_amount: paid_amount,
          remaining_due: updatedBill[0]?.due_amount ?? null,
          bill_status: updatedBill[0]?.bill_status ?? null,
          payment_method: payment_method
        }
      });
    } catch (transactionError) {
      // rollback on error inside transaction
      await connection.rollback();
      throw transactionError;
    } finally {
      // always release connection
      connection.release();
    }
  } catch (error) {
    console.error("Error processing payment:", error);

    // Handle specific errors
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({
        success: false,
        message: "Bill not found for this booking"
      });
    }

    // If error was thrown intentionally with message (e.g. validations), return 400/500 accordingly.
    // Keep previous behavior: generic 500 for DB errors
    res.status(500).json({
      success: false,
      message: "Database error occurred while processing payment"
    });
  }
});

// View Bill Details............................................................................................  
router.get("/bills/:bookingId", authenticateToken, async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    // Guest Details
    const [guestResult] = await db.query("CALL ViewGuestDetails(?)", [bookingId]);
    if (guestResult[0].length === 0) return res.status(404).json({ error: "Booking not found" });

    // Branch Details
    const [branchResult] = await db.query("CALL ViewBranchDetails(?)", [bookingId]);

    // Booking Details
    const [bookingResult] = await db.query("CALL ViewBookingDetails(?)", [bookingId]);

    // Room Charges
    const [roomResult] = await db.query("CALL ViewRoomCharges(?)", [bookingId]);

    // Service Charges
    const [serviceResult] = await db.query("CALL ViewServiceCharges(?)", [bookingId]);

    // Payment + Summary
    const [paymentResult] = await db.query("CALL ViewPaymentAndSummary(?)", [bookingId]);
    const paymentsData = paymentResult[0];
    const summaryData = paymentResult[1][0] || {};

    // Return raw data as an array of results
    const billDetails = {
      guest: guestResult[0][0],
      branch: branchResult[0][0] || {},
      booking: bookingResult[0][0] || {},
      rooms: roomResult[0],
      services: serviceResult[0],
      payments: paymentsData,
      summary: summaryData
    };

    console.log("✅ Bill details fetched successfully by:", req.user?.username || "Unknown");
    res.json(billDetails);
  } catch (error) {
    console.error("❌ Error fetching bill details:", error);
    res.status(500).json({ error: "Database error while fetching bill details" });
  }
});

export default router;

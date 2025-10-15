// import express from "express";
// import db from "../../db.js";
// import { authenticateToken } from "./middleware/authmiddleware.js";

// const router = express.Router();

// // Create Booking
// router.post("/booking", authenticateToken, async (req, res) => {
//   const { guestId, roomNumber, checkinDate, checkoutDate, bill } = req.body;

//   try {
//     const [result] = await db.query(
//       "INSERT INTO Booking (guestId, roomNumber, checkinDate, checkoutDate, status) VALUES (?, ?, ?, ?, 'booked')",
//       [guestId, roomNumber, checkinDate, checkoutDate, bill]
//     );

//     console.log("Booking created by:", req.user?.username || "Unknown");

//     res.json({
//       success: true,
//       bookingId: result.insertId,
//       message: "Booking created successfully",
//     });
//   } catch (error) {
//     console.error("DB insert error:", error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// // Cancel Booking
// router.post("/cancel/:bookingId", authenticateToken, async (req, res) => {
//   const bookingId = req.params.bookingId;

//   try {
//     const [results] = await db.query(
//       "UPDATE Booking SET status = 'cancelled' WHERE booking_id = ?",
//       [bookingId]
//     );

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     console.log("Booking cancelled by:", req.user?.username || "Unknown");

//     res.json({ success: true, message: "Booking cancelled successfully" });
//   } catch (error) {
//     console.error("DB update error:", error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// export default router;


import express from "express";
import db from "../../db.js";
import { authenticateToken } from "./middleware/authmiddleware.js";

const router = express.Router();

// Create Booking
router.post("/:bookingID", authenticateToken, async (req, res) => {
  const { guestId, bookingDate, roomNumber } = req.body;

  const connection = await db.getConnection(); // use transaction
  try {
    await connection.beginTransaction();

    // Use branchId from authenticated user
    const branchId = req.user.branch_id;

    // Use bookingDate as checkinDate
    const effectiveCheckinDate = bookingDate;

    // 1️⃣ Get current number of rooms booked by the guest
    const [existingBookings] = await connection.query(
      `SELECT COALESCE(SUM(number_of_rooms), 0) as totalRooms 
       FROM Booking 
       WHERE guest_id = ? AND status = 'booked'`,
      [guestId]
    );
    const currentRooms = existingBookings[0].totalRooms;
    const numberOfRooms = currentRooms + 1; // Increment by 1 for this new booking

    // 2️⃣ Determine checkoutDate (default to 7 days from bookingDate if not available)
    const defaultCheckoutDate = new Date(bookingDate);
    defaultCheckoutDate.setDate(defaultCheckoutDate.getDate() + 7); // 7-day default stay
    const checkoutDate = defaultCheckoutDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // 3️⃣ Insert into Booking table
    const [bookingResult] = await connection.query(
      `INSERT INTO Booking (guest_id, branch_id, booking_date, status, number_of_rooms,number_of_pax)
       VALUES (?, ?, ?, 'booked', ?,1)`,
      [guestId, branchId, effectiveCheckinDate, numberOfRooms]
    );

    const bookingId = bookingResult.insertId;

    // 4️⃣ Update Booked_Room table
    const [roomResult] = await connection.query(
      `INSERT INTO Booked_Room (room_number, booking_id, branch_id, check_in, check_out, status)
       VALUES (?, ?, ?, ?, ?, 'booked')`,
      [roomNumber, bookingId, branchId, effectiveCheckinDate, checkoutDate]
    );

    // 5️⃣ Fetch room price from Room table
    const [roomPriceResult] = await connection.query(
      `SELECT price FROM Room 
       WHERE room_number = ? AND branch_id = ? AND status = 'available'`,
      [roomNumber, branchId]
    );

    if (roomPriceResult.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: "Room not found or unavailable" });
    }

    const roomPrice = roomPriceResult[0].price;
    const calculatedBillAmount = roomPrice * numberOfRooms; // Adjust bill based on number of rooms

    // 6️⃣ Insert into Bill table with calculated amount
    const [billResult] = await connection.query(
      `INSERT INTO Bill (booking_id, amount, status)
       VALUES (?, ?, 'pending')`,
      [bookingId, calculatedBillAmount]
    );

    await connection.commit();
    connection.release();

    console.log("Booking created by:", req.user?.username || "Unknown");

    res.json({
      success: true,
      bookingId,
      message: "Booking created successfully",
      totalRooms: numberOfRooms,
      billAmount: calculatedBillAmount,
      checkinDate: effectiveCheckinDate,
      checkoutDate,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("DB transaction error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Cancel Booking
router.post("/cancel/:bookingId", authenticateToken, async (req, res) => {
  const bookingId = req.params.bookingId;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Update Booking table
    const [bookingResult] = await connection.query(
      "UPDATE Booking SET status = 'cancelled' WHERE booking_id = ?",
      [bookingId]
    );
    if (bookingResult.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // 2️⃣ Update Booked_Room table
    await connection.query(
      "UPDATE Booked_Room SET status = 'cancelled' WHERE booking_id = ?",
      [bookingId]
    );

    // 3️⃣ Update Bill table
    await connection.query(
      "UPDATE Bill SET status = 'cancelled' WHERE booking_id = ?",
      [bookingId]
    );

    await connection.commit();
    connection.release();

    console.log("Booking cancelled by:", req.user?.username || "Unknown");

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("DB transaction error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

export default router;
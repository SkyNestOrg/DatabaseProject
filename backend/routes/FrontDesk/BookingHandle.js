import express from "express";
import db from "../../db.js";
import { authenticateToken } from "./middleware/authmiddleware.js";

const router = express.Router();

// Create Booking - UPDATED TO MATCH YOUR REQUIREMENTS
router.post("/", authenticateToken, async (req, res) => {
  const { guestId, roomNumber, bookingDate, checkInDate, checkoutDate } = req.body;

  console.log(guestId, roomNumber, bookingDate, checkInDate, checkoutDate);

  if (!guestId || !roomNumber || !bookingDate || !checkInDate || !checkoutDate) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const branchId = req.user.branch_id;

    // 1️⃣ Validate guest
    const [guestResult] = await connection.query(
      "SELECT guest_id FROM Guest WHERE guest_id = ?",
      [guestId]
    );
    if (guestResult.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: "Guest not found" });
    }

    // 2️⃣ Validate room
    const [roomResult] = await connection.query(
      `SELECT r.room_number, r.room_type, rt.base_price as price 
       FROM Room r
       JOIN RoomType rt ON r.room_type = rt.type_name
       WHERE r.room_number = ? AND r.branch_id = ? AND r.current_status = 'Available'`,
      [roomNumber, branchId]
    );
    if (roomResult.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: "Room not found or unavailable" });
    }
    const roomPrice = roomResult[0].price;

    // 3️⃣ Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkoutDate);
    if (isNaN(checkIn.getTime())) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ success: false, message: "Invalid check-in date format" });
    }
    if (isNaN(checkOut.getTime())) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ success: false, message: "Invalid check-out date format" });
    }
    if (checkOut <= checkIn) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ success: false, message: "Check-out date must be after check-in date" });
    }

    // 4️⃣ Insert Booking
    const [bookingResult] = await connection.query(
      `INSERT INTO Booking (guest_id, branch_id, booking_date, status, number_of_rooms, number_of_pax)
       VALUES (?, ?, ?, 'Confirmed', 1, 1)`,
      [guestId, branchId, bookingDate]
    );
    const bookingId = bookingResult.insertId;

    // 5️⃣ Insert Booked_Room
    await connection.query(
      `INSERT INTO Booked_Room (room_number, booking_id, branch_id, check_in, check_out, status)
       VALUES (?, ?, ?, ?, ?, 'Booked')`,
      [roomNumber, bookingId, branchId, checkInDate, checkoutDate]
    );

    // 6️⃣ Update Room status
    await connection.query(
      `UPDATE Room SET current_status = 'Occupied' 
       WHERE room_number = ? AND branch_id = ?`,
      [roomNumber, branchId]
    );

    // 7️⃣ Calculate bill
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const roomTotal = roomPrice * nights;
    const [taxResult] = await connection.query(
      "SELECT latest_tax_percentage, latest_surcharge_percentage FROM Taxes_and_Charges ORDER BY revision_date DESC LIMIT 1"
    );
    const taxPercentage = taxResult.length > 0 ? taxResult[0].latest_tax_percentage : 0;
    const surchargePercentage = taxResult.length > 0 ? taxResult[0].latest_surcharge_percentage : 0;
    const taxAmount = (roomTotal * taxPercentage) / 100;
    const surchargeAmount = (roomTotal * surchargePercentage) / 100;
    const grandTotal = roomTotal + taxAmount + surchargeAmount;

    // 8️⃣ Insert Bill
    const [billResult] = await connection.query(
      `INSERT INTO Bill (booking_id, room_total, tax_amount, due_amount, bill_status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [bookingId, roomTotal, taxAmount + surchargeAmount, grandTotal]
    );

    await connection.commit();
    connection.release();

    res.json({
      success: true,
      bookingId,
      message: "Booking created successfully",
      bill: {
        billId: billResult.insertId,
        roomTotal,
        taxAmount,
        surchargeAmount,
        grandTotal,
        status: "Pending"
      }
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});




// Cancel Booking


router.post("/cancel", authenticateToken, async (req, res) => {

  console.log("Raw body:", req.body);
  const bookingId = req.body.bookingId || req.body.booking_id;
  console.log("Parsed bookingId:", bookingId);

  

  try {
    // 1️⃣ Check if the booking exists
    const [bookingRows] = await db.query(
      "SELECT booking_id FROM Booking WHERE booking_id = ?",
      [bookingId]
    );

    if (bookingRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // 2️⃣ Update booking status → triggers will handle Booked_Room updates automatically
    const [result] = await db.query(
      "UPDATE Booking SET status = 'Cancelled' WHERE booking_id = ?",
      [bookingId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found or already cancelled" });
    }

    

    console.log("Booking cancelled by:", req.user?.username || "Unknown");

    res.json({
      success: true,
      message: "Booking cancelled successfully (trigger handled room updates)",
      bookingId,
    });
  } catch (error) {
    console.error("DB query error:", error);
    res
      .status(500)
      .json({ success: false, message: "Database error", error: error.message });
  }
});

export default router;

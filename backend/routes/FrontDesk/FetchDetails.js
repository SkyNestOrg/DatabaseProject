// import express from "express";
// import db from "../../db.js";
// import { authenticateToken } from "./middleware/authmiddleware.js";

// const router = express.Router();

// router.get("/:bookingId", authenticateToken, (req, res) => {
//   const bookingId = req.params.bookingId;

//   db.query(
//     `SELECT 
//       b.booking_id,
//       CONCAT(g.first_name, ' ', g.last_name) AS guest_name,
//       br2.check_in,
//       br2.check_out,
//       b.status AS booking_status,
//       GROUP_CONCAT(DISTINCT br.room_number SEPARATOR ', ') AS room_numbers,
//       GROUP_CONCAT(DISTINCT r.room_type SEPARATOR ', ') AS room_types,
//       br.branch_name

//      FROM Booking b 
//      JOIN Guest g ON b.guest_id = g.guest_id
//      JOIN Branch br ON b.branch_id = br.branch_id
//      LEFT JOIN Booked_Room br2 ON b.booking_id = br2.booking_id
//      LEFT JOIN Room r ON br2.room_number = r.room_number
//      WHERE b.booking_id = ? 
//      GROUP BY b.booking_id`,
//     [bookingId],
//     (err, results) => {
//       if (err) {
//         console.error('DB query error:', err);
//         return res.status(500).json({ success: false, message: 'Database error' });
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ success: false, message: 'Booking not found' });
//       }
//       return res.json({ success: true, booking: results[0] });
//     }
//   );
// });

// export default router;  // ✅ CORRECT EXPORT


import express from "express";
import db from "../../db.js";
import { authenticateToken } from "./middleware/authmiddleware.js";

const router = express.Router();

router.get("/:bookingId", authenticateToken, async (req, res) => {
  const bookingId = req.params.bookingId;
  console.log("Fetching details for booking ID:", bookingId);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1️⃣ Check if booking exists
    const [bookingRows] = await connection.query(
      "SELECT booking_id, guest_id, branch_id, booking_date, status FROM Booking WHERE booking_id = ?",
      [bookingId]
    );

    if (bookingRows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const booking = bookingRows[0];

    // 2️⃣ Fetch guest details
    const [guestRows] = await connection.query(
      "SELECT first_name, last_name, phone_number, email FROM Guest WHERE guest_id = ?",
      [booking.guest_id]
    );

    const guest = guestRows[0];

    // 3️⃣ Fetch branch details
    const [branchRows] = await connection.query(
      "SELECT branch_name, city, contact_number FROM Branch WHERE branch_id = ?",
      [booking.branch_id]
    );
    const branch = branchRows[0];

    // 4️⃣ Fetch booked rooms
    const [bookedRoomsRows] = await connection.query(
      `SELECT br.room_number, r.room_type, br.check_in, br.check_out
       FROM Booked_Room br
       JOIN Room r ON br.room_number = r.room_number
       WHERE br.booking_id = ?`,
      [bookingId]
    );

    const roomNumbers = bookedRoomsRows.map(r => r.room_number).join(", ");
    const roomTypes = bookedRoomsRows.map(r => r.room_type).join(", ");
    const checkIn = bookedRoomsRows.length > 0 ? bookedRoomsRows[0].check_in : null;
    const checkOut = bookedRoomsRows.length > 0 ? bookedRoomsRows[0].check_out : null;

    await connection.commit();
    connection.release();

    // 5️⃣ Return consolidated booking info
    return res.json({
      success: true,
      booking: {
        booking_id: booking.booking_id,
        guest_name: `${guest.first_name} ${guest.last_name}`,
        phone_number: guest.phone_number,
        email: guest.email,
        booking_date: booking.booking_date,
        check_in: checkIn,
        check_out: checkOut,
        booking_status: booking.status,
        branch_name: branch.branch_name,
        city: branch.city,
        branch_contact: branch.contact_number,
        number_of_rooms: bookedRoomsRows.length,
        room_numbers: roomNumbers,
        room_types: roomTypes
      }
    });

  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("DB query error:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

export default router;

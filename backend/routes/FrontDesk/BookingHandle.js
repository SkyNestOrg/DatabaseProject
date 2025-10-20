import express from "express";
import db from "../../db.js";
import { authenticateToken } from "./middleware/authmiddleware.js";

const router = express.Router();


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


//create booking
router.post("/add", authenticateToken, async (req, res) => {
  const { guestId, roomNumbers, bookingDate, checkInDate, checkoutDate } = req.body;

  console.log("Received data:", { guestId, roomNumbers, bookingDate, checkInDate, checkoutDate });
  console.log("User branch_id:", req.user.branch_id);

  // Validate required fields - roomNumbers should be an array
  if (!guestId || !roomNumbers || !Array.isArray(roomNumbers) || roomNumbers.length === 0 || !bookingDate || !checkInDate || !checkoutDate) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields. Room numbers should be an array with at least one room." 
    });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const branchId = req.user.branch_id || 1;

    // DEBUG: Check all available rooms in this branch
    console.log("Checking available rooms...");
    const [allRooms] = await connection.query(
      `SELECT r.room_number, r.current_status, r.room_type, r.branch_id 
       FROM Room r 
       WHERE r.branch_id = ?`,
      [branchId]
    );
    console.log("All rooms in branch:", allRooms);

    // 1️⃣ Validate guest
    console.log("Validating guest...");
    const [guestResult] = await connection.query(
      "SELECT guest_id FROM Guest WHERE guest_id = ?",
      [guestId]
    );
    
    if (guestResult.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: "Guest not found" });
    }

    // 2️⃣ Validate ALL rooms availability
    console.log("Validating room availability for rooms:", roomNumbers);
    
    // Create placeholders for the IN clause
    const roomPlaceholders = roomNumbers.map(() => '?').join(',');
    
    const [roomsResult] = await connection.query(
      `SELECT r.room_number, r.room_type, r.current_status, rt.base_price as price 
       FROM Room r
       JOIN RoomType rt ON r.room_type = rt.type_name
       WHERE r.room_number IN (${roomPlaceholders}) AND r.branch_id = ? AND r.current_status = 'Available'`,
      [...roomNumbers, branchId]
    );
    
    console.log("Available rooms query result:", roomsResult);
    
    // Check if all requested rooms are available
    if (roomsResult.length !== roomNumbers.length) {
      await connection.rollback();
      connection.release();
      
      // Find which rooms are not available
      const availableRoomNumbers = roomsResult.map(room => room.room_number);
      const unavailableRooms = roomNumbers.filter(roomNum => !availableRoomNumbers.includes(roomNum));
      
      // Get details of unavailable rooms
      const [unavailableDetails] = await connection.query(
        `SELECT room_number, current_status FROM Room 
         WHERE room_number IN (${unavailableRooms.map(() => '?').join(',')}) AND branch_id = ?`,
        [...unavailableRooms, branchId]
      );
      
      const unavailableInfo = unavailableDetails.map(room => 
        `Room ${room.room_number} (${room.current_status})`
      ).join(', ');
      
      return res.status(400).json({ 
        success: false, 
        message: `Some rooms are not available: ${unavailableInfo}` 
      });
    }

    // Calculate total price and collect room types
    let totalRoomPrice = 0;
    const roomDetails = [];
    
    roomsResult.forEach(room => {
      // Convert price to number before adding
      const roomPrice = parseFloat(room.price) || 0;
      totalRoomPrice += roomPrice;
      roomDetails.push({
        room_number: room.room_number,
        room_type: room.room_type,
        price: roomPrice
      });
    });

    console.log("Room details:", roomDetails);
    console.log("Total room price per night:", totalRoomPrice);

    // 3️⃣ Validate dates
    console.log("Validating dates...");
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

    // Calculate number of nights
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    console.log("Number of nights:", nights);

    // 4️⃣ Insert Booking
    console.log("Inserting booking...");
    const [bookingResult] = await connection.query(
      `INSERT INTO Booking (guest_id, branch_id, booking_date, status, number_of_rooms, number_of_pax)
       VALUES (?, ?, ?, 'Confirmed', ?, ?)`,
      [guestId, branchId, bookingDate, roomNumbers.length, roomNumbers.length * 2] // Assuming 2 pax per room
    );
    const bookingId = bookingResult.insertId;
    console.log("Booking ID:", bookingId);

    // 5️⃣ Insert Multiple Booked_Room records
    console.log("Inserting booked rooms...");
    
    // Prepare values for bulk insert
    const bookedRoomValues = roomNumbers.map(roomNumber => 
      [roomNumber, bookingId, branchId, checkInDate, checkoutDate, 'Booked']
    );
    
    const bookedRoomPlaceholders = roomNumbers.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
    
    await connection.query(
      `INSERT INTO Booked_Room (room_number, booking_id, branch_id, check_in, check_out, status)
       VALUES ${bookedRoomPlaceholders}`,
      bookedRoomValues.flat()
    );

    // 6️⃣ Update Room status to 'Booked' instead of 'Occupied' to work with triggers
    console.log("Updating room statuses to 'Booked'...");
    const roomUpdatePlaceholders = roomNumbers.map(() => '?').join(',');
    
    await connection.query(
      `UPDATE Room SET current_status = 'Booked' 
       WHERE room_number IN (${roomUpdatePlaceholders}) AND branch_id = ?`,
      [...roomNumbers, branchId]
    );

    // 7️⃣ Calculate bill for immediate creation (since trigger only creates bill on check-in)
    console.log("Calculating bill for immediate creation...");

    // Ensure totalRoomPrice is a valid number
    if (isNaN(totalRoomPrice) || totalRoomPrice <= 0) {
      await connection.rollback();
      connection.release();
      return res.status(500).json({ 
        success: false, 
        message: "Error calculating room prices. Please check room rates." 
      });
    }

    const roomTotal = parseFloat((totalRoomPrice * nights).toFixed(2));
    
    const [taxResult] = await connection.query(
      "SELECT latest_tax_percentage, latest_surcharge_percentage FROM Taxes_and_Charges ORDER BY revision_date DESC LIMIT 1"
    );
    
    const taxPercentage = taxResult.length > 0 ? parseFloat(taxResult[0].latest_tax_percentage) : 0;
    const surchargePercentage = taxResult.length > 0 ? parseFloat(taxResult[0].latest_surcharge_percentage) : 0;

    // Ensure calculations result in valid numbers
    const taxAmount = parseFloat(((roomTotal * taxPercentage) / 100).toFixed(2));
    const surchargeAmount = parseFloat(((roomTotal * surchargePercentage) / 100).toFixed(2));
    const grandTotal = parseFloat((roomTotal + taxAmount + surchargeAmount).toFixed(2));

    console.log("Bill calculation:", {
      nights,
      roomTotal,
      taxPercentage,
      surchargePercentage,
      taxAmount,
      surchargeAmount,
      grandTotal
    });

    // Validate final amounts before inserting
    if (isNaN(roomTotal) || isNaN(taxAmount) || isNaN(surchargeAmount) || isNaN(grandTotal)) {
      await connection.rollback();
      connection.release();
      return res.status(500).json({ 
        success: false, 
        message: "Error in bill calculation. Invalid numeric values." 
      });
    }

    // 8️⃣ Insert Bill immediately (since your trigger only creates bill on check-in)
    console.log("Inserting bill immediately...");
    const [billResult] = await connection.query(
      `INSERT INTO Bill (bill_date, booking_id, room_total, service_total, tax_amount, due_amount, bill_status)
       VALUES (CURDATE(), ?, ?, 0.00, ?, ?, 'Pending')`,
      [bookingId, roomTotal, taxAmount + surchargeAmount, grandTotal]
    );

    await connection.commit();
    connection.release();

    console.log("Booking created successfully!");
    res.json({
      success: true,
      bookingId,
      message: `Booking created successfully with ${roomNumbers.length} room(s)`,
      rooms: roomDetails,
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
    console.error("Database Error:", error);
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.sqlMessage);
    console.error("Full Error Stack:", error.stack);
    res.status(500).json({ 
      success: false, 
      message: "Database error",
      error: error.sqlMessage
    });
  }
});

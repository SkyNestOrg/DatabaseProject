import express from "express";
import db from "../../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      guest_id,
      branch_name,       // frontend sends branch name
      number_of_pax,
      checkin_date,
      checkout_date,
      room_requests      // array of {room_type, quantity}
    } = req.body;

    // Validate inputs
    if (!guest_id || !branch_name || !number_of_pax || !checkin_date || !checkout_date || !room_requests) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (new Date(checkin_date) >= new Date(checkout_date)) {
      return res.status(400).json({ success: false, message: "Check-out date must be after check-in date" });
    }

    // Lookup branch_id from branch_name
    const [branchRows] = await db.execute(
      "SELECT branch_id FROM branch WHERE branch_name = ? LIMIT 1",
      [branch_name]
    );

    if (branchRows.length === 0) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    const branch_id = branchRows[0].branch_id;

    // Ensure your db connection has multipleStatements: true
    const callQuery = `
      SET @p_result_message = '';
      SET @p_booking_id = 0;
      CALL CreateBookingAtomic(?, ?, ?, ?, ?, ?, ?, @p_result_message, @p_booking_id);
      SELECT @p_result_message AS result_message, @p_booking_id AS booking_id;
    `;

    // IN parameters for procedure
    const inParams = [
      guest_id,
      new Date(),                     // booking_date
      branch_id,
      number_of_pax,
      checkin_date,
      checkout_date,
      JSON.stringify(room_requests)   // convert array to JSON string
    ];

    // Execute multiple statements
    const [results] = await db.query(callQuery, inParams);

    // OUT parameters are in the last result set
    const outRow = results[results.length - 1][0];

    res.json({
      success: true,
      message: outRow.result_message,
      data: { bookingId: outRow.booking_id }
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

export default router;

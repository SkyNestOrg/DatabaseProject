import express from "express";
import db from "../../db.js";
import { authenticateToken } from "./middleware/authmiddleware.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { guest_id, first_name, last_name } = req.body;

    // Check if at least one search parameter is provided
    if (!guest_id && !first_name && !last_name) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide at least one search criteria (guest_id, first_name, or last_name)" 
      });
    }

    let query = `
      SELECT DISTINCT
        g.guest_id,
        g.first_name,
        g.last_name,
        g.email,
        g.phone_number,
        g.address,
        g.passport_number,
        g.country_of_residence,
        g.date_of_birth,
        b.booking_id,
        b.booking_date,
        b.number_of_rooms,
        b.number_of_pax,
        b.status,
        br.branch_name,
        bkr.check_in,
        bkr.check_out
      FROM Guest g
      LEFT JOIN Booking b ON g.guest_id = b.guest_id
      LEFT JOIN Branch br ON b.branch_id = br.branch_id
      JOIN Booked_Room bkr ON bkr.booking_id = b.booking_id
      WHERE 1=1
    `;

    const params = [];

    // Add search conditions using parameterized queries
    if (guest_id) {
      query += " AND g.guest_id = ?";
      params.push(guest_id);
    }
    if (first_name) {
      query += " AND g.first_name LIKE ?";
      params.push(`%${first_name}%`);
    }
    if (last_name) {
      query += " AND g.last_name LIKE ?";
      params.push(`%${last_name}%`);
    }

    query += " ORDER BY b.booking_id DESC";

    // Execute query with parameterized values
    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res.json({ 
        success: true, 
        message: "No guests found matching your search criteria",
        data: [] 
      });
    }

    // Group bookings by guest
    const guestsMap = new Map();
    
    rows.forEach(row => {
      if (!guestsMap.has(row.guest_id)) {
        guestsMap.set(row.guest_id, {
          guest_id: row.guest_id,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          phone_number: row.phone_number,
          address: row.address,
          passport_number: row.passport_number,
          country_of_residence: row.country_of_residence,
          date_of_birth: row.date_of_birth,
          bookings: []
        });
      }

      // Add booking if booking_id exists
      if (row.booking_id) {
        const guest = guestsMap.get(row.guest_id);
        guest.bookings.push({
          booking_id: row.booking_id,
          booking_date: row.booking_date,
          number_of_rooms: row.number_of_rooms,
          number_of_pax: row.number_of_pax,
          status: row.status,
          branch_name: row.branch_name,
          check_in: row.check_in,
          check_out: row.check_out
        });
      }
    });

    const guests = Array.from(guestsMap.values());

    res.json({
      success: true,
      message: `Found ${guests.length} guest(s) matching your search`,
      data: guests
    });

  } catch (error) {
    console.error("Error searching guests:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
});

export default router;
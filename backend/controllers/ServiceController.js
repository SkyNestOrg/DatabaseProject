import db from '../db/connection.js';

export const getDueService = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
            sr.service_request_id,
            sr.request_type,
            sr.status,
            sr.room_number,
            g.first_name,
            g.last_name
            FROM service_request sr
            JOIN booking b ON sr.booking_id = b.booking_id
            JOIN guest g ON b.guest_id = g.guest_id
            WHERE sr.status = 'pending'`
        );
        res.json(rows);
    }
    catch (error) {
        console.log("Error Fetching Due Services:", error);
        res.status(500).json({ message: "Server Error"});
    }
};

export const updateServiceStatus = async (req, res) => {
    const { id } = req.params;
    try {
        // hv to complete this, going to kalhaara's project

    }
    catch (error) {
        console.log("Error updating service status:", error);
        res.status(500).json({ message: "Server Error"});
    }
};
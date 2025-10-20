import db from "../../db.js";
import {
  SERVICE_STATUS,
  SERVICE_TYPES,
} from "./serviceOfficeConstants/constants.js";

export const getDueService = async (req, res) => {
  try {
    const branchId = req.user?.branch_id;
    if (!branchId)
      return res
        .status(400)
        .json({ message: "Branch information missing in token" });

    const [rows] = await db.query(
      `SELECT
            sr.service_request_id,
            sr.booking_id,
            sr.request_type,
            sr.status,
            sr.room_number,
            sr.branch_id,
            g.first_name,
            g.last_name,
            sr.date_time,
            sr.quantity
            FROM service_request sr
            JOIN booking b ON sr.booking_id = b.booking_id
            JOIN guest g ON b.guest_id = g.guest_id
            WHERE sr.status = ? AND sr.branch_id = ?`,
      [SERVICE_STATUS.PENDING, branchId]
    );
    res.json({ requests: rows });
  } catch (error) {
    console.log("Error Fetching Due Services:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

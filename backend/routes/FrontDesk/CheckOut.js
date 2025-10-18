import express from "express";
import db from "../../db.js";
import { authenticateToken } from "./middleware/authmiddleware.js";

const router = express.Router();

// ✅ CHECK-OUT ENDPOINT
router.post("/:bookingId", (req, res) => {
  authenticateToken(req, res, async () => {
    const bookingId = req.params.bookingId;
    const conn = await db.getConnection(); // Get a dedicated connection

    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        "UPDATE Booking SET status = 'CheckedOut' WHERE booking_id = ?",
        [bookingId]
      );

      if (result.affectedRows === 0) {
        await conn.rollback();
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      await conn.commit();

      console.log("✅ CHECK-OUT SUCCESS:", bookingId);
      console.log("👤 Action by:", req.user?.username || "Unknown");

      res.json({
        success: true,
        message: "Guest checked out successfully. Room and booking records updated via triggers.",
      });
    } catch (err) {
      console.error("Transaction error:", err);
      await conn.rollback();
      res.status(500).json({ success: false, message: "Database error" });
    } finally {
      conn.release();
    }
  });
});

export default router;

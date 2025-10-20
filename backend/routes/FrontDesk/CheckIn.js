// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import db from "../../db.js";
// import { authenticateToken } from "./middleware/authmiddleware.js";

// const router = express.Router();
// const secretkey = process.env.JWT_SECRET || "mysecretkey";

// router.post("/:bookingId", (req, res) => {
//   authenticateToken(req, res, () => {
//     const bookingId = req.params.bookingId;

//     db.query(
//       "UPDATE Booking SET status = 'checked-in' WHERE booking_id = ?",
//       [bookingId],
//       (err, result) => {
//         if (err) {
//           console.error("DB update error:", err);
//           return res
//             .status(500)
//             .json({ success: false, message: "Database error" });
//         }
//         else{
//           console.log("DB update result:", result);
//         }

//         if (result.affectedRows === 0) {
//           return res
//             .status(404)
//             .json({ success: false, message: "Booking not found" });
//         }

//         console.log("Booking ID updated:", bookingId);
//         console.log("Checked in by:", req.user?.username || "Unknown");

//         return res.json({
//           success: true,
//           message: "Guest checked in successfully",
//         });
//       }
//     );
//   });
// });

// export default router;


// Updated checkin backend
import express from "express";
import db from "../../db.js";
import { authenticateToken } from "./middleware/authmiddleware.js";

const router = express.Router();

// ✅ Route: POST /api/checkin/:bookingId
router.post("/", authenticateToken, async (req, res) => {
  const bookingId = req.body.booking_id;


  try {
    // ✅ Begin Transaction
    await db.query("START TRANSACTION");

    // ✅ Update only the Booking table (Triggers handle Booked_Room, Room, Bill)
    const [result] = await db.query(
      "UPDATE Booking SET status = 'CheckedIn' WHERE booking_id = ?",
      [bookingId]
    );

    if (result.affectedRows === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // ✅ Commit if successful
    await db.query("COMMIT");

    console.log("✅ CHECK-IN SUCCESS: Booking ID", bookingId);
    console.log("👤 Checked in by:", req.user?.username || "Unknown");

    return res.json({
      success: true,
      message: "Guest checked in successfully",
    });
  } catch (error) {
    console.error("❌ DB Transaction Error:", error);
    await db.query("ROLLBACK");
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

export default router;

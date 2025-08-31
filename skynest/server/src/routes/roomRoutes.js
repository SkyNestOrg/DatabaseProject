import express from "express";
import { searchAvailableRooms } from "../businessLogic/room/roomService.js";

const router = express.Router();

router.post("/search", async (req, res) => {
  const { branch, roomType, checkIn, checkOut } = req.body;

  try {
    const rooms = await searchAvailableRooms(branch, roomType, checkIn, checkOut);
    res.json(rooms);
  } catch (err) {
    console.error("Error searching rooms:", err);
    res.status(500).json({ error: "Server error while searching rooms" });
  }
});

export default router;

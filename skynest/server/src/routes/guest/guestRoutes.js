import { Router } from "express";
const router = Router();
import { registerGuest } from "../../businessLogic/guest/guestService.js";
import { getGuestDetails, updateGuestDetails, bookRoom } from "../../businessLogic/guest/guestService.js";
import { authenticateToken } from "../../middleware/auth.js";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const result = await registerGuest(username, password);
    res.status(201).json({ message: "Guest registered successfully", guestId: result.guestId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    const result = await loginGuest(username, password);
    res.json(result);
  } catch (err) {
    console.error("Error in login route:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});




// Get guest details
router.get("/:guestId", async (req, res) => {
  try {
    const result = await getGuestDetails(req.params.guestId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update guest details
router.put("/:guestId", async (req, res) => {
  try {
    const result = await updateGuestDetails(req.params.guestId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Book a room
router.post("/:guestId/book", async (req, res) => {
  const { roomNumber, checkIn, checkOut } = req.body;
  try {
    const result = await bookRoom(req.params.guestId, roomNumber, checkIn, checkOut);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// All routes require authentication
router.get("/:guestId", authenticateToken, async (req, res) => {
  if (parseInt(req.params.guestId) !== req.user.guestId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const result = await getGuestDetails(req.params.guestId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:guestId", authenticateToken, async (req, res) => {
  if (parseInt(req.params.guestId) !== req.user.guestId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const result = await updateGuestDetails(req.params.guestId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:guestId/book", authenticateToken, async (req, res) => {
  if (parseInt(req.params.guestId) !== req.user.guestId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { roomNumber, checkIn, checkOut } = req.body;
  try {
    const result = await bookRoom(req.params.guestId, roomNumber, checkIn, checkOut);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

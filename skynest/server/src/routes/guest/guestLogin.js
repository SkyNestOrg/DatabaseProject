import { Router } from "express";
const router = Router();
import { loginGuest } from "../../businessLogic/guest/guestService.js";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const result = await loginGuest(username, password);
    res.status(200).json({ message: "Login successful", guestId: result.guestId, username: result.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

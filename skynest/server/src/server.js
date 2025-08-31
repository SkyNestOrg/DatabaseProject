// src/server.js
import express from "express";
import cors from "cors";
import guestRoutes from "./routes/guest/guestRoutes.js";
import guestLogin from "./routes/guest/guestLogin.js";
import roomRoutes from "./routes/roomRoutes.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json()); // replaces body-parser.json()
app.use(express.urlencoded({ extended: true })); // replaces body-parser.urlencoded()

// Routes
app.use("/api/guest", guestRoutes);
app.use("/api/guest", guestLogin);
app.use("/api/room", roomRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port!!! ${PORT}`));




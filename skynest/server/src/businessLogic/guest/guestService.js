// src/businessLogic/guest/guestService.js
import db from "../../db.js";
import { hashPassword, comparePassword } from "../../utils/hash.js"; // Import comparePassword
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // put in .env //REMINDER


// Register a new guest
export const registerGuest = async (username, password) => {
  const hashed = await hashPassword(password);

  const query = "INSERT INTO guest_user (username, password) VALUES (?, ?)";
  try {
    const [result] = await db.execute(query, [username, hashed]);
    return { success: true, guestId: result.insertId, username };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Username already exists");
    }
    throw err;
  }
};




// Login guest
export const loginGuest = async (username, password) => {
  const query = "SELECT * FROM guest_user WHERE username = ?";
  const [rows] = await db.execute(query, [username]);

  if (rows.length === 0) {
    throw new Error("Invalid username or password");
  }

  const guest = rows[0];
  const isMatch = await comparePassword(password, guest.password);

  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  // Generate JWT expiring in 30 mins
  const token = jwt.sign(
    { guestId: guest.guest_id, username: guest.username },
    JWT_SECRET,
    { expiresIn: "30m" }
  );

  return { success: true, guestId: guest.guest_id, username: guest.username, token };
};


// Fetch guest details
export const getGuestDetails = async (guestId) => {
  const query = "SELECT guest_id, username, email, phone, address FROM guest_user WHERE guest_id = ?";
  const [rows] = await db.execute(query, [guestId]);
  if (rows.length === 0) throw new Error("Guest not found");
  return rows[0];
};

// Update guest details
export const updateGuestDetails = async (guestId, details) => {
  const { email, phone, address } = details;
  const query = "UPDATE guest_user SET email = ?, phone = ?, address = ? WHERE guest_id = ?";
  await db.execute(query, [email, phone, address, guestId]);
  return { success: true, message: "Details updated successfully" };
};

// Book a room (Authenticated)
export const bookRoom = async (guestId, roomNumber, checkIn, checkOut) => {
  const query = `
    INSERT INTO booked_room (guest_id, room_number, check_in, check_out)
    VALUES (?, ?, ?, ?)
  `;
  await db.execute(query, [guestId, roomNumber, checkIn, checkOut]);
  return { success: true, message: "Room booked successfully" };
};

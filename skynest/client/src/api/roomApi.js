const API_BASE_URL = "http://localhost:5000/api/room";

// Search available rooms
export const searchRooms = async (branch, roomType, checkIn, checkOut) => {
  try {
    const res = await fetch(`${API_BASE_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch, roomType, checkIn, checkOut }),
    });

    return await res.json();
  } catch (err) {
    console.error("Error searching rooms:", err);
    throw err;
  }
};

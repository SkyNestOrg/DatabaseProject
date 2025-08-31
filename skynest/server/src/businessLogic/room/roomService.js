import db from "../../db.js";

// Example: search available rooms
export const searchAvailableRooms = async (branch, roomType, checkIn, checkOut) => {
    console.log(branch, roomType, checkIn, checkOut);
  const query = `
    SELECT r.type_name, r.description, r.base_rate, r.amentities, rm.room_number 
    FROM roomtype r
    JOIN room rm ON r.type_name = rm.room_type
    JOIN branch br ON br.branch_id = rm.branch_id
    WHERE br.branch_name = ? 
      AND r.type_name = ?
      AND rm.room_number NOT IN (
        SELECT b.room_number 
        FROM booked_room b 
        WHERE (b.check_in < ? AND b.check_out > ?)
      )
  `;
  // bind values in the SAME ORDER as placeholders above
  const [rows] = await db.execute(query, [branch, roomType, checkOut, checkIn]);
  return rows;
  
};

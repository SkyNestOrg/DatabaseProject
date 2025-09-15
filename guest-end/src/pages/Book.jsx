import React, { useState, useEffect } from "react";
import axios from "axios";

const Book = () => {
  const [formData, setFormData] = useState({
    branch_name: "",
    room_type: "",
    number_of_rooms: "",
    number_of_pax: "",
    checkin_date: "",
    checkout_date: "",
  });

  const [guestId, setGuestId] = useState(null);
  const [message, setMessage] = useState("");

  // Get logged-in guest info
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setGuestId(user.id);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!guestId) {
      setMessage("You must be logged in to book a room.");
      return;
    }

    // Validate dates
    if (new Date(formData.checkin_date) >= new Date(formData.checkout_date)) {
      setMessage("Check-out date must be after check-in date");
      return;
    }

    if (!formData.branch_name || !formData.room_type || !formData.number_of_rooms) {
      setMessage("Please provide branch, room type, and number of rooms.");
      return;
    }

    try {
      // Build room_requests JSON array
      const roomRequests = [
        {
          room_type: formData.room_type,
          quantity: Number(formData.number_of_rooms)
        }
      ];

      // Prepare payload for backend
      const payload = {
        guest_id: guestId,
        branch_name: formData.branch_name,
        number_of_pax: Number(formData.number_of_pax),
        checkin_date: formData.checkin_date,
        checkout_date: formData.checkout_date,
        room_requests: roomRequests
      };

      const response = await axios.post("http://localhost:5000/book", payload);

      if (response.data.success) {
        setMessage(
          response.data.message ||
          `Booking successful! Booking ID: ${response.data.data.bookingId}`
        );
      } else {
        setMessage(response.data.message || "Booking failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Booking failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Book a Room</h2>

      {!guestId ? (
        <p className="text-red-500">Please login to make a booking.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="branch_name"
            placeholder="Branch Name"
            value={formData.branch_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="room_type"
            placeholder="Room Type"
            value={formData.room_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="number_of_rooms"
            placeholder="Number of Rooms"
            value={formData.number_of_rooms}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="number_of_pax"
            placeholder="Number of Guests"
            value={formData.number_of_pax}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            name="checkin_date"
            value={formData.checkin_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            name="checkout_date"
            value={formData.checkout_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Book Now
          </button>
        </form>
      )}

      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
};

export default Book;


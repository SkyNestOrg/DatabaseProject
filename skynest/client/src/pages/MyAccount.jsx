import React, { useEffect, useState } from "react";
import { getGuestDetails, updateGuestDetails, bookRoom } from "../api/guestApi";

export default function MyAccount() {
  const guestId = localStorage.getItem("guestId"); // stored after login
  const [details, setDetails] = useState({ email: "", phone: "", address: "" });
  const [booking, setBooking] = useState({ roomNumber: "", checkIn: "", checkOut: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getGuestDetails(guestId);
      if (!data.error) setDetails(data);
    };
    fetchDetails();
  }, [guestId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateGuestDetails(guestId, details);
    setMessage(res.message || res.error);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const res = await bookRoom(guestId, booking);
    setMessage(res.message || res.error);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Account</h2>

      <form onSubmit={handleUpdate}>
        <h3>Edit Details</h3>
        <input value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} placeholder="Email" />
        <input value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} placeholder="Phone" />
        <input value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} placeholder="Address" />
        <button type="submit">Update</button>
      </form>

      <form onSubmit={handleBooking} style={{ marginTop: "2rem" }}>
        <h3>Book a Room</h3>
        <input value={booking.roomNumber} onChange={(e) => setBooking({ ...booking, roomNumber: e.target.value })} placeholder="Room Number" />
        <input type="date" value={booking.checkIn} onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })} />
        <input type="date" value={booking.checkOut} onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })} />
        <button type="submit">Book</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

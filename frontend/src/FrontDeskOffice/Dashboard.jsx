import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import checkAuth from "./checkAuth";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    guestId: "",
    roomNumber: "",
    bookingDate: "",
    checkInDate: "",
    checkoutDate: "",
  });
  const [message, setMessage] = useState("");
  const [searchId, setSearchId] = useState("");
  const [foundBooking, setFoundBooking] = useState(null);

  // ✅ Check login
  React.useEffect(() => {
    const init = async () => {
      const data = await checkAuth();
      if (!data.success) navigate("/frontofficelogin");
      else setUser(JSON.parse(localStorage.getItem("user")));
    };
    init();
  }, [navigate]);

  // ✅ Create Booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/frontdesk/api/booking/add", formData, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      
      if (res.data.success) {
        setMessage(`✅ Booking created! ID: ${res.data.bookingId}`);
        setFormData({
          guestId: "",
          roomNumber: "",
          bookingDate: "",
          checkInDate: "",
          checkoutDate: "",
        });
      } else setMessage(res.data.message || "Error creating booking");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating booking");
    }
  };

  // ✅ Fetch Booking by ID
  const handleFetchBooking = async () => {
    try {
      const res = await axios.get(`/frontdesk/fetch/${searchId}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });

      if (res.data.success) {
        setFoundBooking(res.data.booking);
        setMessage("");
      } else {
        setFoundBooking(null);
        setMessage("Booking not found");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching booking");
    }
  };

  // ✅ Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await axios.post(
        `/frontdesk/api/booking/cancel`,
        { booking_id: bookingId },
        {
          headers: { "x-access-token": localStorage.getItem("token") },
        }
      );

      if (res.data.success) {
        setMessage("✅ Booking cancelled successfully!");
        setFoundBooking((prev) =>
          prev ? { ...prev, booking_status: "Cancelled" } : null
        );
      } else {
        setMessage(res.data.message || "Error cancelling booking");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error cancelling booking");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/frontofficelogin");
  };

  return (
    <div className="grid grid-cols-[200px_1fr] h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between col-span-2">
        <h1 className="text-xl font-bold">Front Desk Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </header>

      {/* Sidebar */}
      <nav className="bg-gray-700 p-4 text-white">
        <button
          onClick={() => navigate("/frontdesk/check")}
          className="block w-full mb-2 p-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Check In/Out
        </button>
        <button
          onClick={() => navigate("/frontdesk/payment")}
          className="block w-full mb-2 p-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Payment
        </button>
        {/* <button
          onClick={() => navigate("/frontdesk/searchguestdetails")}
          className="block w-full p-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Search Guest
        </button> */}
      </nav>

      {/* Main */}
      <main className="p-4 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome, {user?.name || "Front Desk Agent"}!
        </h2>

        {/* 🟢 Create Booking */}
        <form
          onSubmit={handleCreateBooking}
          className="flex flex-col gap-2 max-w-md mb-8"
        >
          <h3 className="text-lg font-medium">Create Booking</h3>
          <input
            placeholder="Guest ID"
            value={formData.guestId}
            onChange={(e) =>
              setFormData({ ...formData, guestId: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            placeholder="Room Number"
            value={formData.roomNumber}
            onChange={(e) =>
              setFormData({ ...formData, roomNumber: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={formData.bookingDate}
            onChange={(e) =>
              setFormData({ ...formData, bookingDate: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={formData.checkInDate}
            onChange={(e) =>
              setFormData({ ...formData, checkInDate: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={formData.checkoutDate}
            onChange={(e) =>
              setFormData({ ...formData, checkoutDate: e.target.value })
            }
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Booking
          </button>
        </form>

        {/* 🔍 Fetch Existing Booking */}
        <div className="max-w-md mb-6">
          <h3 className="text-lg font-medium mb-2">Find Existing Booking</h3>
          <div className="flex gap-2 mb-2">
            <input
              placeholder="Enter Booking ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleFetchBooking}
              className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Search
            </button>
          </div>

          {foundBooking && (
            <div className="border p-4 rounded bg-white shadow-md space-y-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Booking Details
              </h3>

              <p><strong>Booking ID:</strong> {foundBooking.booking_id}</p>
              <p>
                <strong>Booking Date:</strong>{" "}
                {new Date(foundBooking.booking_date).toLocaleDateString()}
              </p>
              <p><strong>Status:</strong> {foundBooking.booking_status}</p>

              <hr className="my-2" />

              <h4 className="text-lg font-medium text-gray-700">
                Guest Information
              </h4>
              <p><strong>Name:</strong> {foundBooking.guest_name}</p>
              <p><strong>Phone:</strong> {foundBooking.phone_number}</p>
              <p><strong>Email:</strong> {foundBooking.email}</p>

              <hr className="my-2" />

              <h4 className="text-lg font-medium text-gray-700">
                Stay Details
              </h4>
              <p>
                <strong>Check-In:</strong>{" "}
                {foundBooking.check_in
                  ? new Date(foundBooking.check_in).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Check-Out:</strong>{" "}
                {foundBooking.check_out
                  ? new Date(foundBooking.check_out).toLocaleDateString()
                  : "N/A"}
              </p>
              <p><strong>Rooms Booked:</strong> {foundBooking.number_of_rooms}</p>
              <p><strong>Room Numbers:</strong> {foundBooking.room_numbers}</p>
              <p><strong>Room Types:</strong> {foundBooking.room_types}</p>

              <hr className="my-2" />

              <h4 className="text-lg font-medium text-gray-700">
                Branch Information
              </h4>
              <p><strong>Branch Name:</strong> {foundBooking.branch_name}</p>
              <p><strong>City:</strong> {foundBooking.city}</p>
              <p><strong>Contact:</strong> {foundBooking.branch_contact}</p>

              {foundBooking.booking_status !== "Cancelled" && (
                <button
                  onClick={() => handleCancelBooking(foundBooking.booking_id)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          )}
        </div>

        {/* 🟡 Message */}
        {message && (
          <p
            className={`p-2 rounded ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

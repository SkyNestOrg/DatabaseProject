// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import checkAuth from "../checkAuth";

// function Dashboard() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate(); // Initialize navigate function
  
//   useEffect(() => {
//     // Check if user is logged in
//     const userData = localStorage.getItem('user');
//     const authToken = localStorage.getItem('token');
    
//     if (userData && authToken) {
//       setUser(JSON.parse(userData));
//     } else {
//       // Redirect to login if not authenticated
//       window.location.href = '/login';
//     }
//     setLoading(false);
//   }, []);

//   const handleLogout = () => {
//     // Clear authentication data
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     // Redirect to login
//     window.location.href = '/login';
//   };

//   // ✅ Fetch Booking by ID
//   const handleFetchBooking = async () => {
//     try {
//       const res = await axios.get(`/frontdesk/fetch/${searchId}`, {
//         headers: { "x-access-token": localStorage.getItem("token") },
//       });

//       if (res.data.success) {
//         setFoundBooking(res.data.booking);
//         setMessage("");
//       } else {
//         setFoundBooking(null);
//         setMessage("Booking not found");
//       }
//     }else if (item === "Check In/Out") {
//       navigate('/frontdesk/check'); // Add other menu item handlers here as needed
//     }else if (item === "Payment") {
//       navigate('/frontdesk/payment'); // Add other menu item handlers here as needed
//     }else if (item === "Search Guest Details") {
//       navigate('/frontdesk/search-guest-details'); // Add other menu item handlers here as needed
//     }
//   };

//   // ✅ Cancel Booking
//   const handleCancelBooking = async (bookingId) => {
//   if (!window.confirm("Are you sure you want to cancel this booking?")) return;

//   try {
//     const res = await axios.post(
//       `/frontdesk/api/booking/cancel`,
//       { booking_id: bookingId }, // ✅ Pass bookingId in JSON body
//       {
//         headers: { "x-access-token": localStorage.getItem("token") },
//       }
//     );

//     if (res.data.success) {
//       setMessage("✅ Booking cancelled successfully!");
//       setFoundBooking((prev) =>
//         prev ? { ...prev, status: "Cancelled" } : null
//       );
//     } else {
//       setMessage(res.data.message || "Error cancelling booking");
//     }
//   } catch (err) {
//     console.error(err);
//     setMessage("❌ Error cancelling booking");
//   }
// };


//   // ✅ Logout
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/frontofficelogin");
//   };

//   return (
//     <div className="grid grid-cols-[200px_1fr] h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-gray-800 text-white p-4 flex justify-between col-span-2">
//         <h1 className="text-xl font-bold">Front Desk Dashboard</h1>
//         <button
//           onClick={handleLogout}
//           className="px-2 py-1 bg-red-500 text-white rounded"
//         >
//           Logout
//         </button>
//       </header>

//       {/* Sidebar */}
//       <nav className="bg-gray-700 p-4 text-white">
//         <button
//           onClick={() => navigate("/check")}
//           className="block w-full mb-2 p-2 bg-blue-500 rounded hover:bg-blue-600"
//         >
//           Check In/Out
//         </button>
//         <button
//           onClick={() => navigate("/payment")}
//           className="block w-full mb-2 p-2 bg-blue-500 rounded hover:bg-blue-600"
//         >
//           Payment
//         </button>
//         <button
//           onClick={() => navigate("/searchguestdetails")}
//           className="block w-full p-2 bg-blue-500 rounded hover:bg-blue-600"
//         >
//           Search Guest
//         </button>
//       </nav>

//       {/* Main */}
//       <main className="p-4 overflow-y-auto">
//         <h2 className="text-2xl font-semibold mb-4">
//           Welcome, {user?.name || "Front Desk Agent"}!
//         </h2>

//         {/* 🟢 Create Booking */}
//         <form
//           onSubmit={handleCreateBooking}
//           className="flex flex-col gap-2 max-w-md mb-8"
//         >
//           <h3 className="text-lg font-medium">Create Booking</h3>
//           <input
//             placeholder="Guest ID"
//             value={formData.guestId}
//             onChange={(e) =>
//               setFormData({ ...formData, guestId: e.target.value })
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             placeholder="Room Number"
//             value={formData.roomNumber}
//             onChange={(e) =>
//               setFormData({ ...formData, roomNumber: e.target.value })
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             type="date"
//             value={formData.bookingDate}
//             onChange={(e) =>
//               setFormData({ ...formData, bookingDate: e.target.value })
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             type="date"
//             value={formData.checkInDate}
//             onChange={(e) =>
//               setFormData({ ...formData, checkInDate: e.target.value })
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             type="date"
//             value={formData.checkoutDate}
//             onChange={(e) =>
//               setFormData({ ...formData, checkoutDate: e.target.value })
//             }
//             className="p-2 border rounded"
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//           >
//             Create Booking
//           </button>
//         </form>

//         {/* 🔍 Fetch Existing Booking */}
//         <div className="max-w-md mb-6">
//           <h3 className="text-lg font-medium mb-2">Find Existing Booking</h3>
//           <div className="flex gap-2 mb-2">
//             <input
//               placeholder="Enter Booking ID"
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//               className="flex-1 p-2 border rounded"
//             />
//             <button
//               onClick={handleFetchBooking}
//               className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Search
//             </button>
//           </div>

//           {foundBooking && (
//             <div className="border p-3 rounded bg-white shadow">
//               <p>
//                 <strong>Booking ID:</strong> {foundBooking.booking_id}
//               </p>
//               <p>
//                 <strong>Guest:</strong> {foundBooking.guest_name}
//               </p>
//               <p>
//                 <strong>Status:</strong> {foundBooking.status}
//               </p>
//               <p>
//                 <strong>Room(s):</strong> {foundBooking.rooms}
//               </p>

//               {foundBooking.status !== "Cancelled" && (
//                 <button
//                   onClick={() => handleCancelBooking(foundBooking.booking_id)}
//                   className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   Cancel Booking
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* 🟡 Message */}
//         {message && (
//           <p
//             className={`p-2 rounded ${
//               message.includes("✅")
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {message}
//           </p>
//         )}
//       </main>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState("bookings");

  // ✅ Check login
  useEffect(() => {
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
      const res = await axios.post("/frontdesk/api/booking", formData, {
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
      } else {
        setMessage(res.data.message || "Error creating booking");
      }
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
        "/frontdesk/api/booking/cancel",
        { booking_id: bookingId },
        {
          headers: { "x-access-token": localStorage.getItem("token") },
        }
      );

      if (res.data.success) {
        setMessage("✅ Booking cancelled successfully!");
        setFoundBooking((prev) =>
          prev ? { ...prev, status: "Cancelled" } : null
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

  // ✅ Sidebar navigation
  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return (
          <div>
            {/* 🟢 Create Booking */}
            <h2 className="text-xl font-semibold mb-4">Create Booking</h2>
            <form onSubmit={handleCreateBooking} className="space-y-3 mb-6">
              <input
                placeholder="Guest ID"
                value={formData.guestId}
                onChange={(e) =>
                  setFormData({ ...formData, guestId: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                placeholder="Room Number"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="date"
                value={formData.bookingDate}
                onChange={(e) =>
                  setFormData({ ...formData, bookingDate: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="date"
                value={formData.checkInDate}
                onChange={(e) =>
                  setFormData({ ...formData, checkInDate: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="date"
                value={formData.checkoutDate}
                onChange={(e) =>
                  setFormData({ ...formData, checkoutDate: e.target.value })
                }
                className="p-2 border rounded w-full"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Booking
              </button>
            </form>

            {/* 🔍 Fetch Existing Booking */}
            <div className="max-w-md mb-6">
              <h3 className="text-lg font-medium mb-2">
                Find Existing Booking
              </h3>
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
                <div className="border p-3 rounded bg-white shadow">
                  <p>
                    <strong>Booking ID:</strong> {foundBooking.booking_id}
                  </p>
                  <p>
                    <strong>Guest:</strong> {foundBooking.guest_name}
                  </p>
                  <p>
                    <strong>Status:</strong> {foundBooking.status}
                  </p>
                  <p>
                    <strong>Room(s):</strong> {foundBooking.rooms}
                  </p>

                  {foundBooking.status !== "Cancelled" && (
                    <button
                      onClick={() =>
                        handleCancelBooking(foundBooking.booking_id)
                      }
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              )}
            </div>

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
          </div>
        );

      case "check":
        navigate("/check");
        return null;
      case "payment":
        navigate("/payment");
        return null;
      case "reports":
        navigate("/report1");
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="bg-gray-700 p-4 text-white w-64">
        <h2 className="text-lg font-semibold mb-4">Front Desk Dashboard</h2>
        <p className="mb-4">{user?.name || "Front Desk Agent"}</p>
        <button
          onClick={handleLogout}
          className="w-full mb-4 bg-red-500 p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`block w-full mb-2 p-2 rounded ${
            activeTab === "bookings"
              ? "bg-blue-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab("check")}
          className={`block w-full mb-2 p-2 rounded ${
            activeTab === "check"
              ? "bg-blue-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Check In/Out
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`block w-full mb-2 p-2 rounded ${
            activeTab === "payment"
              ? "bg-blue-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Payment
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`block w-full mb-2 p-2 rounded ${
            activeTab === "reports"
              ? "bg-blue-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Reports
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}

export default Dashboard;

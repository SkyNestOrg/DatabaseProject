// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import checkAuth from "./checkAuth";

// // function Dashboard() {
// //   const navigate = useNavigate();
// //   const [user, setUser] = useState(null);
// //   const [formData, setFormData] = useState({
// //     guestId: "",
// //     roomNumber: "",
// //     bookingDate: "",
// //     checkInDate: "",
// //     checkoutDate: "",
// //   });
// //   const [message, setMessage] = useState("");
// //   const [searchId, setSearchId] = useState("");
// //   const [foundBooking, setFoundBooking] = useState(null);

// //   // ✅ Check login
// //   React.useEffect(() => {
// //     const init = async () => {
// //       const data = await checkAuth();
// //       if (!data.success) navigate("/frontofficelogin");
// //       else setUser(JSON.parse(localStorage.getItem("user")));
// //     };
// //     init();
// //   }, [navigate]);

// //   // ✅ Create Booking
// //   const handleCreateBooking = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await axios.post("/frontdesk/api/booking/add", formData, {
// //         headers: { "x-access-token": localStorage.getItem("token") },
// //       });
      
// //       if (res.data.success) {
// //         setMessage(`✅ Booking created! ID: ${res.data.bookingId}`);
// //         setFormData({
// //           guestId: "",
// //           roomNumber: "",
// //           bookingDate: "",
// //           checkInDate: "",
// //           checkoutDate: "",
// //         });
// //       } else setMessage(res.data.message || "Error creating booking");
// //     } catch (err) {
// //       console.error(err);
// //       setMessage("❌ Error creating booking");
// //     }
// //   };

// //   // ✅ Fetch Booking by ID
// //   const handleFetchBooking = async () => {
// //     try {
// //       const res = await axios.get(`/frontdesk/fetch/${searchId}`, {
// //         headers: { "x-access-token": localStorage.getItem("token") },
// //       });

// //       if (res.data.success) {
// //         setFoundBooking(res.data.booking);
// //         setMessage("");
// //       } else {
// //         setFoundBooking(null);
// //         setMessage("Booking not found");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setMessage("Error fetching booking");
// //     }
// //   };

// //   // ✅ Cancel Booking
// //   const handleCancelBooking = async (bookingId) => {
// //     if (!window.confirm("Are you sure you want to cancel this booking?")) return;

// //     try {
// //       const res = await axios.post(
// //         `/frontdesk/api/booking/cancel`,
// //         { booking_id: bookingId },
// //         {
// //           headers: { "x-access-token": localStorage.getItem("token") },
// //         }
// //       );

// //       if (res.data.success) {
// //         setMessage("✅ Booking cancelled successfully!");
// //         setFoundBooking((prev) =>
// //           prev ? { ...prev, booking_status: "Cancelled" } : null
// //         );
// //       } else {
// //         setMessage(res.data.message || "Error cancelling booking");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setMessage("❌ Error cancelling booking");
// //     }
// //   };

// //   // ✅ Logout
// //   const handleLogout = () => {
// //     localStorage.clear();
// //     navigate("/frontofficelogin");
// //   };

// //   return (
// //     <div className="grid grid-cols-[200px_1fr] h-screen bg-gray-100">
// //       {/* Header */}
// //       <header className="bg-gray-800 text-white p-4 flex justify-between col-span-2">
// //         <h1 className="text-xl font-bold">Front Desk Dashboard</h1>
// //         <button
// //           onClick={handleLogout}
// //           className="px-2 py-1 bg-red-500 text-white rounded"
// //         >
// //           Logout
// //         </button>
// //       </header>

// //       {/* Sidebar */}
// //       <nav className="bg-gray-700 p-4 text-white">
// //         <button
// //           onClick={() => navigate("/frontdesk/check")}
// //           className="block w-full mb-2 p-2 bg-blue-500 rounded hover:bg-blue-600"
// //         >
// //           Check In/Out
// //         </button>
// //         <button
// //           onClick={() => navigate("/frontdesk/payment")}
// //           className="block w-full mb-2 p-2 bg-blue-500 rounded hover:bg-blue-600"
// //         >
// //           Payment
// //         </button>
// //         {/* <button
// //           onClick={() => navigate("/frontdesk/searchguestdetails")}
// //           className="block w-full p-2 bg-blue-500 rounded hover:bg-blue-600"
// //         >
// //           Search Guest
// //         </button> */}
// //       </nav>

// //       {/* Main */}
// //       <main className="p-4 overflow-y-auto">
// //         <h2 className="text-2xl font-semibold mb-4">
// //           Welcome, {user?.name || "Front Desk Agent"}!
// //         </h2>

// //         {/* 🟢 Create Booking */}
// //         <form
// //           onSubmit={handleCreateBooking}
// //           className="flex flex-col gap-2 max-w-md mb-8"
// //         >
// //           <h3 className="text-lg font-medium">Create Booking</h3>
// //           <input
// //             placeholder="Guest ID"
// //             value={formData.guestId}
// //             onChange={(e) =>
// //               setFormData({ ...formData, guestId: e.target.value })
// //             }
// //             className="p-2 border rounded"
// //           />
// //           <input
// //             placeholder="Room Number"
// //             value={formData.roomNumber}
// //             onChange={(e) =>
// //               setFormData({ ...formData, roomNumber: e.target.value })
// //             }
// //             className="p-2 border rounded"
// //           />
// //           <input
// //             type="date"
// //             value={formData.bookingDate}
// //             onChange={(e) =>
// //               setFormData({ ...formData, bookingDate: e.target.value })
// //             }
// //             className="p-2 border rounded"
// //           />
// //           <input
// //             type="date"
// //             value={formData.checkInDate}
// //             onChange={(e) =>
// //               setFormData({ ...formData, checkInDate: e.target.value })
// //             }
// //             className="p-2 border rounded"
// //           />
// //           <input
// //             type="date"
// //             value={formData.checkoutDate}
// //             onChange={(e) =>
// //               setFormData({ ...formData, checkoutDate: e.target.value })
// //             }
// //             className="p-2 border rounded"
// //           />
// //           <button
// //             type="submit"
// //             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //           >
// //             Create Booking
// //           </button>
// //         </form>

// //         {/* 🔍 Fetch Existing Booking */}
// //         <div className="max-w-md mb-6">
// //           <h3 className="text-lg font-medium mb-2">Find Existing Booking</h3>
// //           <div className="flex gap-2 mb-2">
// //             <input
// //               placeholder="Enter Booking ID"
// //               value={searchId}
// //               onChange={(e) => setSearchId(e.target.value)}
// //               className="flex-1 p-2 border rounded"
// //             />
// //             <button
// //               onClick={handleFetchBooking}
// //               className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
// //             >
// //               Search
// //             </button>
// //           </div>

// //           {foundBooking && (
// //             <div className="border p-4 rounded bg-white shadow-md space-y-2">
// //               <h3 className="text-xl font-semibold mb-2 text-gray-800">
// //                 Booking Details
// //               </h3>

// //               <p><strong>Booking ID:</strong> {foundBooking.booking_id}</p>
// //               <p>
// //                 <strong>Booking Date:</strong>{" "}
// //                 {new Date(foundBooking.booking_date).toLocaleDateString()}
// //               </p>
// //               <p><strong>Status:</strong> {foundBooking.booking_status}</p>

// //               <hr className="my-2" />

// //               <h4 className="text-lg font-medium text-gray-700">
// //                 Guest Information
// //               </h4>
// //               <p><strong>Name:</strong> {foundBooking.guest_name}</p>
// //               <p><strong>Phone:</strong> {foundBooking.phone_number}</p>
// //               <p><strong>Email:</strong> {foundBooking.email}</p>

// //               <hr className="my-2" />

// //               <h4 className="text-lg font-medium text-gray-700">
// //                 Stay Details
// //               </h4>
// //               <p>
// //                 <strong>Check-In:</strong>{" "}
// //                 {foundBooking.check_in
// //                   ? new Date(foundBooking.check_in).toLocaleDateString()
// //                   : "N/A"}
// //               </p>
// //               <p>
// //                 <strong>Check-Out:</strong>{" "}
// //                 {foundBooking.check_out
// //                   ? new Date(foundBooking.check_out).toLocaleDateString()
// //                   : "N/A"}
// //               </p>
// //               <p><strong>Rooms Booked:</strong> {foundBooking.number_of_rooms}</p>
// //               <p><strong>Room Numbers:</strong> {foundBooking.room_numbers}</p>
// //               <p><strong>Room Types:</strong> {foundBooking.room_types}</p>

// //               <hr className="my-2" />

// //               <h4 className="text-lg font-medium text-gray-700">
// //                 Branch Information
// //               </h4>
// //               <p><strong>Branch Name:</strong> {foundBooking.branch_name}</p>
// //               <p><strong>City:</strong> {foundBooking.city}</p>
// //               <p><strong>Contact:</strong> {foundBooking.branch_contact}</p>

// //               {foundBooking.booking_status !== "Cancelled" && (
// //                 <button
// //                   onClick={() => handleCancelBooking(foundBooking.booking_id)}
// //                   className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
// //                 >
// //                   Cancel Booking
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //         </div>

// //         {/* 🟡 Message */}
// //         {message && (
// //           <p
// //             className={`p-2 rounded ${
// //               message.includes("✅")
// //                 ? "bg-green-100 text-green-700"
// //                 : "bg-red-100 text-red-700"
// //             }`}
// //           >
// //             {message}
// //           </p>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// // export default Dashboard;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import checkAuth from './checkAuth';

// function Dashboard() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [searchId, setSearchId] = useState('');
//   const [foundBooking, setFoundBooking] = useState(null);
//   const [formData, setFormData] = useState({
//     guestId: "",
//     roomNumber: "",
//     bookingDate: "",
//     checkInDate: "",
//     checkoutDate: "",
//   });
//   const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard', 'create', 'cancel'

//   const navigate = useNavigate();

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const userData = localStorage.getItem('user');
        
//         if (!token || !userData) {
//           setError('No authentication data found. Redirecting to login...');
//           setTimeout(() => navigate('/login'), 2000);
//           return;
//         }

//         const data = await checkAuth();
//         if (!data.success) {
//           setError('Session expired or invalid. Redirecting to login...');
//           setTimeout(() => navigate('/login'), 2000);
//         } else {
//           setUser(JSON.parse(userData));
//           setError('');
//         }
//       } catch (err) {
//         console.error('Error in authentication check:', err);
//         setError('Authentication error. Redirecting to login...');
//         setTimeout(() => navigate('/login'), 2000);
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//   }, [navigate]);

//   // ✅ Create Booking
//   // const handleCreateBooking = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const res = await axios.post("/frontdesk/api/booking/add", formData, {
//   //       headers: { "x-access-token": localStorage.getItem("token") },
//   //     });
      
//   //     if (res.data.success) {
//   //       setMessage(`✅ Booking created! ID: ${res.data.bookingId}`);
//   //       setFormData({
//   //         guestId: "",
//   //         roomNumber: "",
//   //         bookingDate: "",
//   //         checkInDate: "",
//   //         checkoutDate: "",
//   //       });
//   //     } else {
//   //       setMessage(res.data.message || "Error creating booking");
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     setMessage("❌ Error creating booking");
//   //   }
//   // };

// //   const handleCreateBooking = async (e) => {
// //   e.preventDefault();
// //   setMessage(""); // Clear previous messages
  
// //   try {
// //     const res = await axios.post("/frontdesk/api/booking/add", formData, {
// //       headers: { "x-access-token": localStorage.getItem("token") },
// //     });
    
// //     if (res.data.success) {
// //       setMessage(`✅ Booking created! ID: ${res.data.bookingId}`);
// //       setFormData({
// //         guestId: "",
// //         roomNumber: "",
// //         bookingDate: "",
// //         checkInDate: "",
// //         checkoutDate: "",
// //       });
// //     } else {
// //       setMessage(`❌ ${res.data.message || "Error creating booking"}`);
// //     }
// //   } catch (err) {
// //     console.error("Frontend Error:", err);
// //     if (err.response?.data?.message) {
// //       setMessage(`❌ ${err.response.data.message}`);
// //     } else if (err.response?.data?.error) {
// //       setMessage(`❌ Database Error: ${err.response.data.error}`);
// //     } else {
// //       setMessage("❌ Error creating booking");
// //     }
// //   }
// // };

//   const handleCreateBooking = async (e) => {
//   e.preventDefault();
//   setMessage(""); // Clear previous messages
  
//   try {
//     // Convert roomNumbers string to array if it's a string
//     const processedData = {
//       ...formData,
//       roomNumbers: Array.isArray(formData.roomNumbers) 
//         ? formData.roomNumbers 
//         : formData.roomNumbers.split(',').map(room => room.trim()).filter(room => room)
//     };
    
//     const res = await axios.post("/frontdesk/api/booking/add", processedData, {
//       headers: { "x-access-token": localStorage.getItem("token") },
//     });
    
//     if (res.data.success) {
//       setMessage(`✅ Booking created! ID: ${res.data.bookingId} with ${res.data.rooms?.length || 0} room(s)`);
//       setFormData({
//         guestId: "",
//         roomNumbers: "",
//         bookingDate: "",
//         checkInDate: "",
//         checkoutDate: "",
//       });
//     } else {
//       setMessage(`❌ ${res.data.message || "Error creating booking"}`);
//     }
//   } catch (err) {
//     console.error("Frontend Error:", err);
//     if (err.response?.data?.message) {
//       setMessage(`❌ ${err.response.data.message}`);
//     } else if (err.response?.data?.error) {
//       setMessage(`❌ Database Error: ${err.response.data.error}`);
//     } else {
//       setMessage("❌ Error creating booking");
//     }
//   }
// };
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
//     } catch (err) {
//       console.error(err);
//       setMessage("Error fetching booking");
//     }
//   };

//   // ✅ Cancel Booking
//   const handleCancelBooking = async (bookingId) => {
//     if (!window.confirm("Are you sure you want to cancel this booking?")) return;

//     try {
//       const res = await axios.post(
//         `/frontdesk/api/booking/cancel`,
//         { booking_id: bookingId },
//         {
//           headers: { "x-access-token": localStorage.getItem("token") },
//         }
//       );

//       if (res.data.success) {
//         setMessage("✅ Booking cancelled successfully!");
//         setFoundBooking((prev) =>
//           prev ? { ...prev, booking_status: "Cancelled" } : null
//         );
//       } else {
//         setMessage(res.data.message || "Error cancelling booking");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error cancelling booking");
//     }
//   };

//   // Clear search and results
//   const handleClearSearch = () => {
//     setSearchId("");
//     setFoundBooking(null);
//     setMessage("");
//   };

//   // ✅ Fixed Logout function - navigate to /login instead of /frontofficelogin
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   const handleMenuItemClick = (item) => {
//     if (item === 'Check In/Out') {
//       navigate('/frontdesk/check');
//     } else if (item === 'Payment') {
//       navigate('/frontdesk/payment');
//     } else if (item === 'Search Guest Details') {
//       navigate('/frontdesk/searchguestdetails');
//     } else if (item === 'Create Booking') {
//       setActiveSection('create');
//       setMessage("");
//       setFoundBooking(null);
//     } else if (item === 'Cancel Booking') {
//       setActiveSection('cancel');
//       setMessage("");
//       handleClearSearch(); // Clear previous search when navigating to cancel booking
//     }
//   };

//   const styles = {
//     dashboard: {
//       display: 'grid',
//       gridTemplateAreas: `
//         "header header"
//         "sidebar content"
//       `,
//       gridTemplateColumns: '220px 1fr',
//       gridTemplateRows: '70px 1fr',
//       height: '100vh',
//       fontFamily: 'Segoe UI, sans-serif',
//     },
//     header: {
//       gridArea: 'header',
//       backgroundColor: '#2c3e50',
//       color: 'white',
//       padding: '1rem 2rem',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       fontSize: '1.4rem',
//       boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
//     },
//     userInfo: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '1rem',
//       fontSize: '1rem',
//     },
//     logoutButton: {
//       background: 'transparent',
//       border: '1px solid white',
//       color: 'white',
//       padding: '0.5rem 1rem',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '0.9rem',
//     },
//     sidebar: {
//       gridArea: 'sidebar',
//       backgroundColor: '#34495e',
//       color: 'white',
//       padding: '2rem 1rem',
//       borderTopRightRadius: '12px',
//       boxShadow: '2px 0 6px rgba(0,0,0,0.2)',
//     },
//     sidebarList: {
//       listStyle: 'none',
//       padding: 0,
//       margin: 0,
//     },
//     sidebarItem: {
//       margin: '1rem 0',
//       cursor: 'pointer',
//       padding: '0.6rem 1rem',
//       borderRadius: '8px',
//       transition: 'background 0.3s',
//     },
//     content: {
//       gridArea: 'content',
//       padding: '2rem',
//       background: 'linear-gradient(135deg, #f6f9fc, #dbe9f4)',
//       borderTopLeftRadius: '12px',
//       overflowY: 'auto',
//     },
//     loading: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       fontSize: '1.2rem',
//     },
//     error: {
//       padding: '0.5rem',
//       background: '#f8d7da',
//       color: '#721c24',
//       borderRadius: '4px',
//       marginBottom: '1rem',
//       textAlign: 'center',
//     },
//     message: {
//       padding: '0.5rem',
//       borderRadius: '4px',
//       marginBottom: '1rem',
//       textAlign: 'center',
//     },
//     successMessage: {
//       background: '#d4edda',
//       color: '#155724',
//     },
//     errorMessage: {
//       background: '#f8d7da',
//       color: '#721c24',
//     },
//     welcomeSection: {
//       textAlign: 'center',
//       fontSize: '1.5rem',
//       color: '#2c3e50',
//       fontWeight: 'bold',
//       marginBottom: '2rem',
//     },
//     formContainer: {
//       backgroundColor: 'white',
//       padding: '2rem',
//       borderRadius: '10px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//       maxWidth: '500px',
//       margin: '0 auto',
//     },
//     formTitle: {
//       fontSize: '1.5rem',
//       fontWeight: 'bold',
//       marginBottom: '1.5rem',
//       color: '#2c3e50',
//       textAlign: 'center',
//     },
//     formGroup: {
//       marginBottom: '1rem',
//     },
//     label: {
//       display: 'block',
//       marginBottom: '0.5rem',
//       fontWeight: '600',
//       color: '#34495e',
//     },
//     input: {
//       width: '100%',
//       padding: '0.75rem',
//       border: '1px solid #ddd',
//       borderRadius: '6px',
//       fontSize: '1rem',
//       boxSizing: 'border-box',
//     },
//     submitButton: {
//       width: '100%',
//       padding: '0.75rem',
//       backgroundColor: '#27ae60',
//       color: 'white',
//       border: 'none',
//       borderRadius: '6px',
//       fontSize: '1rem',
//       cursor: 'pointer',
//       fontWeight: '600',
//     },
//     searchContainer: {
//       backgroundColor: 'white',
//       padding: '2rem',
//       borderRadius: '10px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//       maxWidth: '600px',
//       margin: '0 auto',
//     },
//     searchRow: {
//       display: 'flex',
//       gap: '1rem',
//       marginBottom: '1rem',
//     },
//     searchInput: {
//       flex: '1',
//       padding: '0.75rem',
//       border: '1px solid #ddd',
//       borderRadius: '6px',
//       fontSize: '1rem',
//     },
//     searchButton: {
//       padding: '0.75rem 1.5rem',
//       backgroundColor: '#3498db',
//       color: 'white',
//       border: 'none',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontWeight: '600',
//     },
//     clearButton: {
//       padding: '0.75rem 1.5rem',
//       backgroundColor: '#95a5a6',
//       color: 'white',
//       border: 'none',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontWeight: '600',
//     },
//     bookingCard: {
//       backgroundColor: 'white',
//       padding: '1.5rem',
//       borderRadius: '8px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//       marginTop: '1rem',
//     },
//     bookingTitle: {
//       fontSize: '1.3rem',
//       fontWeight: 'bold',
//       marginBottom: '1rem',
//       color: '#2c3e50',
//     },
//     bookingSection: {
//       marginBottom: '1rem',
//       paddingBottom: '1rem',
//       borderBottom: '1px solid #ecf0f1',
//     },
//     sectionTitle: {
//       fontSize: '1.1rem',
//       fontWeight: '600',
//       marginBottom: '0.5rem',
//       color: '#34495e',
//     },
//     cancelButton: {
//       padding: '0.75rem 1.5rem',
//       backgroundColor: '#e74c3c',
//       color: 'white',
//       border: 'none',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontWeight: '600',
//       marginTop: '1rem',
//     },
//   };

//   const menuItems = [
//     'Create Booking',
//     'Cancel Booking',
//     'Check In/Out',
//     'Payment',
//     'Search Guest Details',
//   ];

//   if (loading) {
//     return <div style={styles.loading}>Loading...</div>;
//   }

//   if (!user && !error) {
//     return <div style={styles.loading}>Redirecting to login...</div>;
//   }

//   return (
//     <div style={styles.dashboard}>
//       <header style={styles.header}>
//         <div>FrontOffice Dashboard</div>
//         <div style={styles.userInfo}>
//           <span>Welcome, {user?.name || user?.username || 'User'}!</span>
//           <button
//             style={styles.logoutButton}
//             onClick={handleLogout}
//             onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')}
//             onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <nav style={styles.sidebar}>
//         <ul style={styles.sidebarList}>
//           {menuItems.map((item, index) => (
//             <li
//               key={index}
//               style={styles.sidebarItem}
//               onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1abc9c')}
//               onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
//               onClick={() => handleMenuItemClick(item)}
//             >
//               {item}
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <main style={styles.content}>
//         {error && <div style={styles.error}>{error}</div>}
        
//         {message && (
//           <div style={{
//             ...styles.message,
//             ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
//           }}>
//             {message}
//           </div>
//         )}

//         {activeSection === 'dashboard' && (
//           <div style={styles.welcomeSection}>
//             <div>Welcome to SkyNest HRGSMS FrontDesk Portal</div>
//             <div style={{ fontSize: '1rem', marginTop: '1rem', fontWeight: 'normal' }}>
//               FrontDesk User: {user?.name || user?.username || 'User'}
//             </div>
//             <div style={{ fontSize: '0.9rem', marginTop: '2rem', color: '#7f8c8d' }}>
//               Select an option from the sidebar to get started
//             </div>
//           </div>
//         )}

//         {activeSection === 'create' && (
//           <div style={styles.formContainer}>
//             <h3 style={styles.formTitle}>Create New Booking</h3>
//             <form onSubmit={handleCreateBooking}>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Guest ID</label>
//                 <input
//                   type="text"
//                   placeholder="Guest ID"
//                   value={formData.guestId}
//                   onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Room Number</label>
//                 <input
//                   type="text"
//                   placeholder="Room Number"
//                   value={formData.roomNumber}
//                   onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Booking Date</label>
//                 <input
//                   type="date"
//                   value={formData.bookingDate}
//                   onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Check-in Date</label>
//                 <input
//                   type="date"
//                   value={formData.checkInDate}
//                   onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Check-out Date</label>
//                 <input
//                   type="date"
//                   value={formData.checkoutDate}
//                   onChange={(e) => setFormData({ ...formData, checkoutDate: e.target.value })}
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <button type="submit" style={styles.submitButton}>
//                 Create Booking
//               </button>
//             </form>
//           </div>
//         )}

//         {activeSection === 'cancel' && (
//           <div style={styles.searchContainer}>
//             <h3 style={styles.formTitle}>Cancel Booking</h3>
            
//             <div style={styles.searchRow}>
//               <input
//                 type="text"
//                 placeholder="Enter Booking ID"
//                 value={searchId}
//                 onChange={(e) => setSearchId(e.target.value)}
//                 style={styles.searchInput}
//               />
//               <button
//                 onClick={handleFetchBooking}
//                 style={styles.searchButton}
//               >
//                 Search
//               </button>
//               {(searchId || foundBooking) && (
//                 <button
//                   onClick={handleClearSearch}
//                   style={styles.clearButton}
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>

//             {foundBooking && (
//               <div style={styles.bookingCard}>
//                 <h3 style={styles.bookingTitle}>Booking Details</h3>

//                 <div style={styles.bookingSection}>
//                   <h4 style={styles.sectionTitle}>Booking Information</h4>
//                   <p><strong>Booking ID:</strong> {foundBooking.booking_id}</p>
//                   <p><strong>Booking Date:</strong> {new Date(foundBooking.booking_date).toLocaleDateString()}</p>
//                   <p><strong>Status:</strong> {foundBooking.booking_status}</p>
//                 </div>

//                 <div style={styles.bookingSection}>
//                   <h4 style={styles.sectionTitle}>Guest Information</h4>
//                   <p><strong>Name:</strong> {foundBooking.guest_name}</p>
//                   <p><strong>Phone:</strong> {foundBooking.phone_number}</p>
//                   <p><strong>Email:</strong> {foundBooking.email}</p>
//                 </div>

//                 <div style={styles.bookingSection}>
//                   <h4 style={styles.sectionTitle}>Stay Details</h4>
//                   <p><strong>Check-In:</strong> {foundBooking.check_in ? new Date(foundBooking.check_in).toLocaleDateString() : "N/A"}</p>
//                   <p><strong>Check-Out:</strong> {foundBooking.check_out ? new Date(foundBooking.check_out).toLocaleDateString() : "N/A"}</p>
//                   <p><strong>Rooms Booked:</strong> {foundBooking.number_of_rooms}</p>
//                   <p><strong>Room Numbers:</strong> {foundBooking.room_numbers}</p>
//                   <p><strong>Room Types:</strong> {foundBooking.room_types}</p>
//                 </div>

//                 <div style={styles.bookingSection}>
//                   <h4 style={styles.sectionTitle}>Branch Information</h4>
//                   <p><strong>Branch Name:</strong> {foundBooking.branch_name}</p>
//                   <p><strong>City:</strong> {foundBooking.city}</p>
//                   <p><strong>Contact:</strong> {foundBooking.branch_contact}</p>
//                 </div>

//                 {foundBooking.booking_status !== "Cancelled" && (
//                   <button
//                     onClick={() => handleCancelBooking(foundBooking.booking_id)}
//                     style={styles.cancelButton}
//                   >
//                     Cancel Booking
//                   </button>
//                 )}

//                 {foundBooking.booking_status === "Cancelled" && (
//                   <div style={{ 
//                     padding: '0.75rem', 
//                     backgroundColor: '#f8d7da', 
//                     color: '#721c24', 
//                     borderRadius: '6px',
//                     marginTop: '1rem',
//                     textAlign: 'center'
//                   }}>
//                     This booking has already been cancelled
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import checkAuth from './checkAuth';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchId, setSearchId] = useState('');
  const [foundBooking, setFoundBooking] = useState(null);
  const [formData, setFormData] = useState({
    guestId: "",
    bookingDate: "",
    checkInDate: "",
    checkoutDate: "",
  });
  const [roomNumbers, setRoomNumbers] = useState([""]); // Array for multiple room inputs
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard', 'create', 'cancel'

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          setError('No authentication data found. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const data = await checkAuth();
        if (!data.success) {
          setError('Session expired or invalid. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setUser(JSON.parse(userData));
          setError('');
        }
      } catch (err) {
        console.error('Error in authentication check:', err);
        setError('Authentication error. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  // Add a new room input field
  const addRoomField = () => {
    setRoomNumbers([...roomNumbers, ""]);
  };

  // Remove a room input field
  const removeRoomField = (index) => {
    if (roomNumbers.length > 1) {
      const newRooms = roomNumbers.filter((_, i) => i !== index);
      setRoomNumbers(newRooms);
    }
  };

  // Update a specific room input
  const handleRoomChange = (index, value) => {
    const newRooms = [...roomNumbers];
    newRooms[index] = value;
    setRoomNumbers(newRooms);
  };

  // ✅ Create Booking with multiple rooms
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      // Process room numbers - remove empty strings and convert to numbers
      const roomNumbersArray = roomNumbers
        .map(room => room.trim())
        .filter(room => room !== "")
        .map(room => parseInt(room))
        .filter(room => !isNaN(room));

      // Validation
      if (roomNumbersArray.length === 0) {
        throw new Error("At least one room number is required");
      }

      const processedData = {
        guestId: parseInt(formData.guestId),
        roomNumbers: roomNumbersArray,
        bookingDate: formData.bookingDate,
        checkInDate: formData.checkInDate,
        checkoutDate: formData.checkoutDate
      };

      console.log("Sending booking data:", processedData);

      const res = await axios.post("/frontdesk/api/booking/add", processedData, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      
      if (res.data.success) {
        setMessage(`✅ Booking created! ID: ${res.data.bookingId} with ${res.data.rooms?.length || 0} room(s)`);
        // Reset form
        setFormData({
          guestId: "",
          bookingDate: "",
          checkInDate: "",
          checkoutDate: "",
        });
        setRoomNumbers([""]); // Reset to one empty room field
      } else {
        setMessage(`❌ ${res.data.message || "Error creating booking"}`);
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else if (err.response?.data?.error) {
        setMessage(`❌ Database Error: ${err.response.data.error}`);
      } else {
        setMessage(`❌ ${err.message || "Error creating booking"}`);
      }
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

  // Clear search and results
  const handleClearSearch = () => {
    setSearchId("");
    setFoundBooking(null);
    setMessage("");
  };

  // ✅ Fixed Logout function - navigate to /login instead of /frontofficelogin
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleMenuItemClick = (item) => {
    if (item === 'Check In/Out') {
      navigate('/frontdesk/check');
    } else if (item === 'Payment') {
      navigate('/frontdesk/payment');
    } else if (item === 'Search Guest Details') {
      navigate('/frontdesk/searchguestdetails');
    } else if (item === 'Create Booking') {
      setActiveSection('create');
      setMessage("");
      setFoundBooking(null);
    } else if (item === 'Cancel Booking') {
      setActiveSection('cancel');
      setMessage("");
      handleClearSearch(); // Clear previous search when navigating to cancel booking
    }
  };

  const styles = {
    dashboard: {
      display: 'grid',
      gridTemplateAreas: `
        "header header"
        "sidebar content"
      `,
      gridTemplateColumns: '220px 1fr',
      gridTemplateRows: '70px 1fr',
      height: '100vh',
      fontFamily: 'Segoe UI, sans-serif',
    },
    header: {
      gridArea: 'header',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '1.4rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontSize: '1rem',
    },
    logoutButton: {
      background: 'transparent',
      border: '1px solid white',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    sidebar: {
      gridArea: 'sidebar',
      backgroundColor: '#34495e',
      color: 'white',
      padding: '2rem 1rem',
      borderTopRightRadius: '12px',
      boxShadow: '2px 0 6px rgba(0,0,0,0.2)',
    },
    sidebarList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    sidebarItem: {
      margin: '1rem 0',
      cursor: 'pointer',
      padding: '0.6rem 1rem',
      borderRadius: '8px',
      transition: 'background 0.3s',
    },
    content: {
      gridArea: 'content',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f6f9fc, #dbe9f4)',
      borderTopLeftRadius: '12px',
      overflowY: 'auto',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
    },
    error: {
      padding: '0.5rem',
      background: '#f8d7da',
      color: '#721c24',
      borderRadius: '4px',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    message: {
      padding: '0.5rem',
      borderRadius: '4px',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    successMessage: {
      background: '#d4edda',
      color: '#155724',
    },
    errorMessage: {
      background: '#f8d7da',
      color: '#721c24',
    },
    welcomeSection: {
      textAlign: 'center',
      fontSize: '1.5rem',
      color: '#2c3e50',
      fontWeight: 'bold',
      marginBottom: '2rem',
    },
    formContainer: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '0 auto',
    },
    formTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#2c3e50',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#34495e',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '1rem',
      boxSizing: 'border-box',
    },
    submitButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: '600',
    },
    // NEW STYLES FOR MULTIPLE ROOM INPUTS
    roomSection: {
      border: '1px solid #e0e0e0',
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      marginBottom: '1rem',
    },
    roomHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    roomTitle: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      margin: 0,
      color: '#2c3e50',
    },
    addButton: {
      background: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      fontSize: '1.2rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    roomInputGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    roomInput: {
      flex: 1,
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    removeButton: {
      background: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchContainer: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto',
    },
    searchRow: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem',
    },
    searchInput: {
      flex: '1',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '1rem',
    },
    searchButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
    },
    clearButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
    },
    bookingCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '1rem',
    },
    bookingTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#2c3e50',
    },
    bookingSection: {
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #ecf0f1',
    },
    sectionTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#34495e',
    },
    cancelButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      marginTop: '1rem',
    },
  };

  const menuItems = [
    'Create Booking',
    'Cancel Booking',
    'Check In/Out',
    'Payment',
    'Search Guest Details',
  ];

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!user && !error) {
    return <div style={styles.loading}>Redirecting to login...</div>;
  }

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div>FrontOffice Dashboard</div>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.name || user?.username || 'User'}!</span>
          <button
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            Logout
          </button>
        </div>
      </header>

      <nav style={styles.sidebar}>
        <ul style={styles.sidebarList}>
          {menuItems.map((item, index) => (
            <li
              key={index}
              style={styles.sidebarItem}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1abc9c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => handleMenuItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>

      <main style={styles.content}>
        {error && <div style={styles.error}>{error}</div>}
        
        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </div>
        )}

        {activeSection === 'dashboard' && (
          <div style={styles.welcomeSection}>
            <div>Welcome to SkyNest HRGSMS FrontDesk Portal</div>
            <div style={{ fontSize: '1rem', marginTop: '1rem', fontWeight: 'normal' }}>
              FrontDesk User: {user?.name || user?.username || 'User'}
            </div>
            <div style={{ fontSize: '0.9rem', marginTop: '2rem', color: '#7f8c8d' }}>
              Select an option from the sidebar to get started
            </div>
          </div>
        )}

        {activeSection === 'create' && (
          <div style={styles.formContainer}>
            <h3 style={styles.formTitle}>Create New Booking</h3>
            <form onSubmit={handleCreateBooking}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Guest ID</label>
                <input
                  type="text"
                  placeholder="Guest ID"
                  value={formData.guestId}
                  onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              {/* MULTIPLE ROOM NUMBERS SECTION */}
              <div style={styles.roomSection}>
                <div style={styles.roomHeader}>
                  <h4 style={styles.roomTitle}>Room Numbers</h4>
                  <button
                    type="button"
                    onClick={addRoomField}
                    style={styles.addButton}
                    title="Add another room"
                  >
                    +
                  </button>
                </div>
                
                {roomNumbers.map((roomNumber, index) => (
                  <div key={index} style={styles.roomInputGroup}>
                    <input
                      type="text"
                      placeholder={`Room ${index + 1}`}
                      value={roomNumber}
                      onChange={(e) => handleRoomChange(index, e.target.value)}
                      style={styles.roomInput}
                      required={index === 0} // Only first room is required
                    />
                    {roomNumbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoomField(index)}
                        style={styles.removeButton}
                        title="Remove this room"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.5rem' }}>
                  Add multiple rooms for the same booking
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Booking Date</label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Check-in Date</label>
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Check-out Date</label>
                <input
                  type="date"
                  value={formData.checkoutDate}
                  onChange={(e) => setFormData({ ...formData, checkoutDate: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <button type="submit" style={styles.submitButton}>
                Create Booking
              </button>
            </form>
          </div>
        )}

        {activeSection === 'cancel' && (
          <div style={styles.searchContainer}>
            <h3 style={styles.formTitle}>Cancel Booking</h3>
            
            <div style={styles.searchRow}>
              <input
                type="text"
                placeholder="Enter Booking ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={styles.searchInput}
              />
              <button
                onClick={handleFetchBooking}
                style={styles.searchButton}
              >
                Search
              </button>
              {(searchId || foundBooking) && (
                <button
                  onClick={handleClearSearch}
                  style={styles.clearButton}
                >
                  Clear
                </button>
              )}
            </div>

            {foundBooking && (
              <div style={styles.bookingCard}>
                <h3 style={styles.bookingTitle}>Booking Details</h3>

                <div style={styles.bookingSection}>
                  <h4 style={styles.sectionTitle}>Booking Information</h4>
                  <p><strong>Booking ID:</strong> {foundBooking.booking_id}</p>
                  <p><strong>Booking Date:</strong> {new Date(foundBooking.booking_date).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {foundBooking.booking_status}</p>
                </div>

                <div style={styles.bookingSection}>
                  <h4 style={styles.sectionTitle}>Guest Information</h4>
                  <p><strong>Name:</strong> {foundBooking.guest_name}</p>
                  <p><strong>Phone:</strong> {foundBooking.phone_number}</p>
                  <p><strong>Email:</strong> {foundBooking.email}</p>
                </div>

                <div style={styles.bookingSection}>
                  <h4 style={styles.sectionTitle}>Stay Details</h4>
                  <p><strong>Check-In:</strong> {foundBooking.check_in ? new Date(foundBooking.check_in).toLocaleDateString() : "N/A"}</p>
                  <p><strong>Check-Out:</strong> {foundBooking.check_out ? new Date(foundBooking.check_out).toLocaleDateString() : "N/A"}</p>
                  <p><strong>Rooms Booked:</strong> {foundBooking.number_of_rooms}</p>
                  <p><strong>Room Numbers:</strong> {foundBooking.room_numbers}</p>
                  <p><strong>Room Types:</strong> {foundBooking.room_types}</p>
                </div>

                <div style={styles.bookingSection}>
                  <h4 style={styles.sectionTitle}>Branch Information</h4>
                  <p><strong>Branch Name:</strong> {foundBooking.branch_name}</p>
                  <p><strong>City:</strong> {foundBooking.city}</p>
                  <p><strong>Contact:</strong> {foundBooking.branch_contact}</p>
                </div>

                {foundBooking.booking_status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelBooking(foundBooking.booking_id)}
                    style={styles.cancelButton}
                  >
                    Cancel Booking
                  </button>
                )}

                {foundBooking.booking_status === "Cancelled" && (
                  <div style={{ 
                    padding: '0.75rem', 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    borderRadius: '6px',
                    marginTop: '1rem',
                    textAlign: 'center'
                  }}>
                    This booking has already been cancelled
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

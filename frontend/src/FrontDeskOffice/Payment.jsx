// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import checkAuth from "./checkAuth";

// function Payment() {
//   const [bookingId, setBookingId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [billData, setBillData] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     checkAuth().then((data) => {
//       if (!data.success) navigate("/frontofficelogin");
//       setLoading(false);
//     });
//   }, [navigate]);

//   // Fetch Bill Details
//   const fetchBillDetails = async () => {
//     if (!bookingId || isNaN(bookingId)) {
//       setBillData(null);
//       setMessage("Please enter a valid booking ID");
//       return;
//     }
//     try {
//       const res = await axios.get(`/frontdesk/api/payments/bills/${bookingId}`, {
//         headers: { "x-access-token": localStorage.getItem("token") },
//       });
//       setBillData(res.data);
//       setMessage("");
//     } catch (err) {
//       setMessage("Failed to fetch bill details");
//       setBillData(null);
//     }
//   };

//   // Make Payment
//   const handleMakePayment = async () => {
//     if (!amount || !bookingId) {
//       setMessage("Please enter amount and booking ID");
//       return;
//     }
//     try {
//       await axios.post(
//         `/frontdesk/api/payments/add/${bookingId}`,
//         {
//           payment_method: paymentMethod,
//           paid_amount: parseFloat(amount),
//         },
//         { headers: { "x-access-token": localStorage.getItem("token") } }
//       );
//       setMessage("Payment successful!");
//       setAmount("");
//       fetchBillDetails();
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Payment failed");
//     }
//   };

//   // Cancel Last Payment
//   const handleCancelPayment = async () => {
//     if (!bookingId) {
//       setMessage("Please enter a booking ID");
//       return;
//     }
//     try {
//       await axios.post(`/frontdesk/api/payments/cancel/${bookingId}`, {}, {
//         headers: { "x-access-token": localStorage.getItem("token") },
//       });
//       setMessage("Last payment cancelled");
//       fetchBillDetails();
//     } catch (err) {
//       setMessage("Cancel payment failed");
//     }
//   };

//   if (loading) return <div className="text-center mt-10">Loading...</div>;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Management</h1>

//       <div className="flex flex-col gap-4 w-full max-w-md">
//         <input
//           type="number"
//           placeholder="Booking ID"
//           value={bookingId}
//           onChange={(e) => setBookingId(e.target.value)}
//           className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <input
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <select
//           value={paymentMethod}
//           onChange={(e) => setPaymentMethod(e.target.value)}
//           className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="cash">Cash</option>
//           <option value="card">Card</option>
//           <option value="online">Online</option>
//         </select>

//         <button
//           onClick={fetchBillDetails}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//         >
//           View Bill
//         </button>

//         <button
//           onClick={handleMakePayment}
//           className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//         >
//           Make Payment
//         </button>

//         <button
//           onClick={handleCancelPayment}
//           className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//         >
//           Cancel Last Payment
//         </button>
//       </div>

//       {message && (
//         <p
//           className={`mt-4 p-2 rounded-lg ${
//             message.toLowerCase().includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//           }`}
//         >
//           {message}
//         </p>
//       )}

//       {billData && (
//         <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-4xl">
//           {/* Guest Info */}
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Guest Information</h2>
//             <p><strong>Name:</strong> {billData.guest.first_name} {billData.guest.last_name}</p>
//             <p><strong>Email:</strong> {billData.guest.email}</p>
//             <p><strong>Phone:</strong> {billData.guest.phone_number}</p>
//           </div>

//           {/* Branch Info */}
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Branch Information</h2>
//             <p><strong>Name:</strong> {billData.branch.branch_name}</p>
//             <p><strong>Address:</strong> {billData.branch.branch_address}, {billData.branch.branch_city}</p>
//             <p><strong>Contact:</strong> {billData.branch.branch_contact}</p>
//           </div>

//           {/* Booking Info */}
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Booking Information</h2>
//             <p><strong>Booking ID:</strong> {billData.booking.booking_id}</p>
//             <p><strong>Date:</strong> {new Date(billData.booking.booking_date).toLocaleString()}</p>
//           </div>

//           {/* Payments */}
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Payments</h2>
//             {billData.payments.length > 0 ? (
//               <table className="w-full table-auto border border-gray-300">
//                 <thead className="bg-gray-200">
//                   <tr>
//                     <th className="border px-2 py-1">Reference</th>
//                     <th className="border px-2 py-1">Method</th>
//                     <th className="border px-2 py-1">Amount</th>
//                     <th className="border px-2 py-1">Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {billData.payments.map((pay, idx) => (
//                     <tr key={idx} className="text-center">
//                       <td className="border px-2 py-1">{pay.payment_reference}</td>
//                       <td className="border px-2 py-1">{pay.payment_method}</td>
//                       <td className="border px-2 py-1">{pay.paid_amount}</td>
//                       <td className="border px-2 py-1">{new Date(pay.payment_date).toLocaleString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : <p>No payments made.</p>}
//           </div>

//           {/* Summary */}
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Summary</h2>
//             <p><strong>Grand Total:</strong> {billData.summary.grand_total}</p>
//             <p><strong>Total Paid:</strong> {billData.summary.total_paid}</p>
//             <p><strong>Due Amount:</strong> {billData.summary.due_amount}</p>
//             <p><strong>Bill Status:</strong> {billData.summary.bill_status}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Payment;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import checkAuth from "./checkAuth";

function Payment() {
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [billData, setBillData] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then((data) => {
      if (!data.success) navigate("/frontofficelogin");
      setAuthLoading(false);
    });
  }, [navigate]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch Bill Details
  const fetchBillDetails = async () => {
    if (!bookingId || isNaN(bookingId)) {
      setBillData(null);
      setMessage("");
      setError("Please enter a valid booking ID");
      return;
    }

    try {
      setSearchLoading(true);
      setError("");
      setMessage("");
      const res = await axios.get(`/frontdesk/api/payments/bills/${bookingId}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      setBillData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bill details");
      setBillData(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // Make Payment
  const handleMakePayment = async () => {
    if (!amount || !bookingId) {
      setError("Please enter amount and booking ID");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      await axios.post(
        `/frontdesk/api/payments/add/${bookingId}`,
        { 
          payment_method: paymentMethod, 
          paid_amount: parseFloat(amount) 
        },
        { headers: { "x-access-token": localStorage.getItem("token") } }
      );
      setMessage("Payment successful!");
      setAmount("");
      fetchBillDetails(); // Refresh bill details
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // Cancel Last Payment
  const handleCancelPayment = async () => {
    if (!bookingId) {
      setError("Please enter a booking ID");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      await axios.post(
        `/frontdesk/api/payments/cancel/${bookingId}`,
        {},
        { headers: { "x-access-token": localStorage.getItem("token") } }
      );
      setMessage("Last payment cancelled");
      fetchBillDetails(); // Refresh bill details
    } catch (err) {
      setError("Cancel payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBookingId("");
    setBillData(null);
    setAmount("");
    setError("");
    setMessage("");
  };

  if (authLoading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Payment Management</h1>

      {(message || error) && (
        <div style={message ? styles.successMessage : styles.errorMessage}>
          {message || error}
          <button 
            onClick={() => { setMessage(""); setError(""); }} 
            style={styles.closeMessageBtn}
          >
            ×
          </button>
        </div>
      )}

      <div style={styles.searchSection}>
        <label style={styles.label}>Booking ID *</label>
        <div style={styles.searchRow}>
          <input
            type="number"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="Enter Booking ID"
            style={styles.input}
            onKeyPress={(e) => e.key === "Enter" && fetchBillDetails()}
          />
          <button 
            style={styles.searchBtn} 
            onClick={fetchBillDetails} 
            disabled={searchLoading}
          >
            {searchLoading ? "Searching..." : "Search Bill"}
          </button>
          {billData && (
            <button style={styles.clearBtn} onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
      </div>

      {billData && (
        <div style={styles.billSection}>
          <h3 style={styles.sectionTitle}>Bill Details</h3>

          {/* Guest Info */}
          <div style={styles.infoCard}>
            <h4 style={styles.cardTitle}>Guest Information</h4>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <strong>Name:</strong> {billData.guest.first_name} {billData.guest.last_name}
              </div>
              <div style={styles.infoItem}>
                <strong>Email:</strong> {billData.guest.email}
              </div>
              <div style={styles.infoItem}>
                <strong>Phone:</strong> {billData.guest.phone_number}
              </div>
            </div>
          </div>

          {/* Branch Info */}
          <div style={styles.infoCard}>
            <h4 style={styles.cardTitle}>Branch Information</h4>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <strong>Name:</strong> {billData.branch.branch_name}
              </div>
              <div style={styles.infoItem}>
                <strong>Address:</strong> {billData.branch.branch_address}, {billData.branch.branch_city}
              </div>
              <div style={styles.infoItem}>
                <strong>Contact:</strong> {billData.branch.branch_contact}
              </div>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div style={styles.billCard}>
            <div style={styles.billHeader}>
              <div>
                <strong>Booking ID:</strong> {billData.booking.booking_id}
              </div>
              <div>
                <strong>Booking Date:</strong> {formatDate(billData.booking.booking_date)}
              </div>
            </div>

            <div style={styles.billAmounts}>
              <div style={styles.amountRow}>
                <span>Grand Total:</span>
                <span style={styles.amount}>{formatCurrency(billData.summary.grand_total)}</span>
              </div>
              <div style={styles.amountRow}>
                <span>Total Paid:</span>
                <span style={styles.amount}>{formatCurrency(billData.summary.total_paid)}</span>
              </div>
              <div style={{ ...styles.amountRow, ...styles.dueAmount }}>
                <span>Due Amount:</span>
                <span style={styles.amount}>{formatCurrency(billData.summary.due_amount)}</span>
              </div>
              <div style={styles.amountRow}>
                <span>Status:</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      billData.summary.bill_status === "Paid"
                        ? "#27ae60"
                        : billData.summary.bill_status === "Pending"
                        ? "#f39c12"
                        : "#e74c3c",
                  }}
                >
                  {billData.summary.bill_status}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          {billData.summary.bill_status !== "Paid" && (
            <div style={styles.paymentFormSection}>
              <h4 style={styles.subSectionTitle}>Make Payment</h4>
              <div style={styles.paymentForm}>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={styles.selectInput}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                </select>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Amount"
                  style={styles.numberInput}
                  min="0"
                  step="0.01"
                />

                <div style={styles.paymentButtons}>
                  <button 
                    style={styles.payBtn} 
                    onClick={handleMakePayment} 
                    disabled={loading || !amount}
                  >
                    {loading ? "Processing..." : `Pay ${formatCurrency(amount)}`}
                  </button>

                  <button 
                    style={styles.cancelBtn} 
                    onClick={handleCancelPayment} 
                    disabled={loading}
                  >
                    Cancel Last Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          {billData.payments.length > 0 && (
            <div style={styles.historySection}>
              <h4 style={styles.subSectionTitle}>Payment History</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Reference</th>
                    <th style={styles.th}>Method</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {billData.payments.map((pay, idx) => (
                    <tr key={idx} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                      <td style={styles.td}>{pay.payment_reference}</td>
                      <td style={styles.td}>
                        <span style={styles.methodBadge}>{pay.payment_method}</span>
                      </td>
                      <td style={styles.td}>{formatCurrency(pay.paid_amount)}</td>
                      <td style={styles.td}>{formatDate(pay.payment_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { 
    padding: "2rem", 
    maxWidth: "1000px", 
    margin: "0 auto", 
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh"
  },
  header: { 
    fontSize: "2.5rem", 
    fontWeight: "bold", 
    marginBottom: "2rem",
    color: "#2c3e50",
    textAlign: "center"
  },
  searchSection: { 
    marginBottom: "2rem",
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#34495e"
  },
  searchRow: { 
    display: "flex", 
    gap: "1rem", 
    alignItems: "center",
    flexWrap: "wrap"
  },
  input: { 
    flex: "1", 
    padding: "0.75rem", 
    borderRadius: "6px", 
    border: "1px solid #ddd",
    fontSize: "1rem",
    minWidth: "200px"
  },
  searchBtn: { 
    padding: "0.75rem 1.5rem", 
    background: "#3498db", 
    color: "#fff", 
    border: "none", 
    borderRadius: "6px", 
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background 0.3s ease"
  },
  clearBtn: { 
    padding: "0.75rem 1.5rem", 
    background: "#95a5a6", 
    color: "#fff", 
    border: "none", 
    borderRadius: "6px", 
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background 0.3s ease"
  },
  billSection: { 
    marginTop: "1rem" 
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    color: "#2c3e50",
    borderBottom: "2px solid #3498db",
    paddingBottom: "0.5rem"
  },
  infoCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#34495e"
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem"
  },
  infoItem: {
    padding: "0.5rem 0"
  },
  billCard: { 
    border: "1px solid #e0e0e0", 
    borderRadius: "10px", 
    padding: "1.5rem", 
    marginBottom: "1.5rem",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  billHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    flexWrap: "wrap",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #ecf0f1"
  },
  billAmounts: { 
    marginTop: "1rem", 
    display: "flex", 
    flexDirection: "column", 
    gap: "0.75rem" 
  },
  amountRow: { 
    display: "flex", 
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0"
  },
  amount: {
    fontWeight: "600",
    fontSize: "1.1rem"
  },
  dueAmount: { 
    color: "#e74c3c", 
    fontWeight: "bold",
    fontSize: "1.2rem",
    padding: "0.75rem",
    backgroundColor: "#fdf2f2",
    borderRadius: "6px"
  },
  statusBadge: { 
    color: "#fff", 
    padding: "0.4rem 1rem", 
    borderRadius: "20px", 
    fontWeight: "600",
    fontSize: "0.9rem"
  },
  paymentFormSection: { 
    marginTop: "2rem", 
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  subSectionTitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#2c3e50"
  },
  paymentForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  selectInput: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    maxWidth: "200px"
  },
  numberInput: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    maxWidth: "200px"
  },
  paymentButtons: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap"
  },
  payBtn: { 
    background: "#27ae60", 
    color: "#fff", 
    border: "none", 
    padding: "0.75rem 1.5rem", 
    borderRadius: "6px", 
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background 0.3s ease"
  },
  cancelBtn: { 
    background: "#e74c3c", 
    color: "#fff", 
    border: "none", 
    padding: "0.75rem 1.5rem", 
    borderRadius: "6px", 
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background 0.3s ease"
  },
  historySection: { 
    marginTop: "2rem",
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  table: { 
    width: "100%", 
    borderCollapse: "collapse",
    marginTop: "1rem"
  },
  th: { 
    textAlign: "left", 
    borderBottom: "2px solid #34495e", 
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    fontWeight: "600",
    color: "#2c3e50"
  },
  td: { 
    padding: "1rem", 
    borderBottom: "1px solid #ecf0f1" 
  },
  evenRow: {
    backgroundColor: "#f8f9fa"
  },
  oddRow: {
    backgroundColor: "white"
  },
  methodBadge: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "0.3rem 0.8rem",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "600"
  },
  successMessage: { 
    background: "#d4edda", 
    color: "#155724", 
    padding: "1rem", 
    borderRadius: "6px", 
    marginBottom: "1.5rem",
    border: "1px solid #c3e6cb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  errorMessage: { 
    background: "#f8d7da", 
    color: "#721c24", 
    padding: "1rem", 
    borderRadius: "6px", 
    marginBottom: "1.5rem",
    border: "1px solid #f5c6cb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  closeMessageBtn: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "inherit",
    padding: "0",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "background 0.3s ease"
  },
  loading: { 
    textAlign: "center", 
    marginTop: "2rem",
    fontSize: "1.2rem",
    color: "#7f8c8d"
  },
};

// Add hover effects
styles.searchBtn = {
  ...styles.searchBtn,
  ':hover': {
    background: "#2980b9",
  },
};

styles.clearBtn = {
  ...styles.clearBtn,
  ':hover': {
    background: "#7f8c8d",
  },
};

styles.payBtn = {
  ...styles.payBtn,
  ':hover': {
    background: "#219653",
  },
};

styles.cancelBtn = {
  ...styles.cancelBtn,
  ':hover': {
    background: "#c0392b",
  },
};

styles.closeMessageBtn = {
  ...styles.closeMessageBtn,
  ':hover': {
    background: "rgba(0,0,0,0.1)",
  },
};

export default Payment;
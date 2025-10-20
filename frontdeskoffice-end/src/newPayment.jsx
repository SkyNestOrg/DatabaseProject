import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import checkAuth from "../checkAuth";

function Payment() {
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [billData, setBillData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then((data) => {
      if (!data.success) navigate("/frontofficelogin");
      setLoading(false);
    });
  }, [navigate]);

  // Fetch Bill Details
  const fetchBillDetails = async () => {
    if (!bookingId || isNaN(bookingId)) {
      setBillData(null);
      setMessage("Please enter a valid booking ID");
      return;
    }
    try {
      const res = await axios.get(`/frontdesk/api/payments/bills/${bookingId}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      setBillData(res.data);
      setMessage("");
    } catch (err) {
      setMessage("Failed to fetch bill details");
      setBillData(null);
    }
  };

  // Make Payment
  const handleMakePayment = async () => {
    if (!amount || !bookingId) {
      setMessage("Please enter amount and booking ID");
      return;
    }
    try {
      await axios.post(
        `/frontdesk/api/payments/add/${bookingId}`,
        {
          payment_method: paymentMethod,
          paid_amount: parseFloat(amount),
        },
        { headers: { "x-access-token": localStorage.getItem("token") } }
      );
      setMessage("Payment successful!");
      setAmount("");
      fetchBillDetails();
    } catch (err) {
      setMessage(err.response?.data?.message || "Payment failed");
    }
  };

  // Cancel Last Payment
  const handleCancelPayment = async () => {
    if (!bookingId) {
      setMessage("Please enter a booking ID");
      return;
    }
    try {
      await axios.post(`/frontdesk/api/payments/cancel/${bookingId}`, {}, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      setMessage("Last payment cancelled");
      fetchBillDetails();
    } catch (err) {
      setMessage("Cancel payment failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Management</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="number"
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="online">Online</option>
        </select>

        <button
          onClick={fetchBillDetails}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          View Bill
        </button>

        <button
          onClick={handleMakePayment}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Make Payment
        </button>

        <button
          onClick={handleCancelPayment}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Cancel Last Payment
        </button>
      </div>

      {message && (
        <p
          className={`mt-4 p-2 rounded-lg ${
            message.toLowerCase().includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      {billData && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-4xl">
          {/* Guest Info */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Guest Information</h2>
            <p><strong>Name:</strong> {billData.guest.first_name} {billData.guest.last_name}</p>
            <p><strong>Email:</strong> {billData.guest.email}</p>
            <p><strong>Phone:</strong> {billData.guest.phone_number}</p>
          </div>

          {/* Branch Info */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Branch Information</h2>
            <p><strong>Name:</strong> {billData.branch.branch_name}</p>
            <p><strong>Address:</strong> {billData.branch.branch_address}, {billData.branch.branch_city}</p>
            <p><strong>Contact:</strong> {billData.branch.branch_contact}</p>
          </div>

          {/* Booking Info */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Booking Information</h2>
            <p><strong>Booking ID:</strong> {billData.booking.booking_id}</p>
            <p><strong>Date:</strong> {new Date(billData.booking.booking_date).toLocaleString()}</p>
          </div>

          {/* Payments */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Payments</h2>
            {billData.payments.length > 0 ? (
              <table className="w-full table-auto border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-1">Reference</th>
                    <th className="border px-2 py-1">Method</th>
                    <th className="border px-2 py-1">Amount</th>
                    <th className="border px-2 py-1">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {billData.payments.map((pay, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border px-2 py-1">{pay.payment_reference}</td>
                      <td className="border px-2 py-1">{pay.payment_method}</td>
                      <td className="border px-2 py-1">{pay.paid_amount}</td>
                      <td className="border px-2 py-1">{new Date(pay.payment_date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No payments made.</p>}
          </div>

          {/* Summary */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p><strong>Grand Total:</strong> {billData.summary.grand_total}</p>
            <p><strong>Total Paid:</strong> {billData.summary.total_paid}</p>
            <p><strong>Due Amount:</strong> {billData.summary.due_amount}</p>
            <p><strong>Bill Status:</strong> {billData.summary.bill_status}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
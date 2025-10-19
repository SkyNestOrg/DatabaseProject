import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import checkAuth from '../checkAuth';

function Check() {
  const [bookingId, setBookingId] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(data => {
      if (!data.success) navigate('/frontofficelogin');
      setLoading(false);
    });
  }, [navigate]);

  const fetchBookingDetails = async () => {
    if (!bookingId || isNaN(bookingId)) {
      setBookingDetails(null);
      setMessage('Please enter a valid booking ID');
      return;
    }
    try {
      const res = await axios.get(`/frontdesk/fetch/${bookingId}`, {
        headers: { 'x-access-token': localStorage.getItem('token') }
      });
      if (res.data.success) {
        setBookingDetails(res.data.booking);
        setMessage('');
      } else {
        setMessage('Booking not found');
        setBookingDetails(null);
      }
    } catch (err) {
      setMessage('Failed to fetch booking details');
      setBookingDetails(null);
    }
  };

  const handleCheckIn = async () => {
    if (!bookingDetails) return;
    try {
      const res = await axios.post(`/frontdesk/checkin`, { booking_id: bookingId }, {
        headers: { 'x-access-token': localStorage.getItem('token') }
      });
      if (res.data.success) {
        setMessage('Checked in successfully!');
        fetchBookingDetails(); // Refresh details
      } else {
        setMessage(res.data.message || 'Check-in failed');
      }
    } catch (err) {
      setMessage('Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    if (!bookingDetails || bookingDetails.booking_status === 'checked-out') return;
    try {
      const res = await axios.post(`/frontdesk/checkout/${bookingId}`, {}, {
        headers: { 'x-access-token': localStorage.getItem('token') }
      });
      if (res.data.success) {
        setMessage('Checked out successfully!');
        setBookingDetails({ ...bookingDetails, booking_status: 'checked-out' });
      } else {
        setMessage(res.data.message || 'Check-out failed');
      }
    } catch (err) {
      setMessage('Check-out failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Check In/Out</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="number"
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchBookingDetails}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Fetch Details
        </button>
      </div>

      {bookingDetails && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Booking Details</h2>

          <p><strong>Guest:</strong> {bookingDetails.guest_name}</p>
          <p><strong>Phone:</strong> {bookingDetails.phone_number}</p>
          <p><strong>Email:</strong> {bookingDetails.email}</p>
          <p><strong>Booking Date:</strong> {bookingDetails.booking_date}</p>
          <p><strong>Check-in:</strong> {bookingDetails.check_in}</p>
          <p><strong>Check-out:</strong> {bookingDetails.check_out}</p>
          <p><strong>Status:</strong> {bookingDetails.booking_status}</p>
          <p><strong>Branch:</strong> {bookingDetails.branch_name} ({bookingDetails.city})</p>
          <p><strong>Branch Contact:</strong> {bookingDetails.branch_contact}</p>
          <p><strong>Number of Rooms:</strong> {bookingDetails.number_of_rooms}</p>
          <p><strong>Room Numbers:</strong> {bookingDetails.room_numbers}</p>
          <p><strong>Room Types:</strong> {bookingDetails.room_types}</p>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleCheckIn}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
              disabled={bookingDetails.booking_status === 'CheckedIn'}
            >
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
              disabled={bookingDetails.booking_status === 'checked-out'}
            >
              Check Out
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className={`mt-4 p-2 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Check;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import checkAuth from '../checkAuth';

function Check() {
  const [bookingId, setBookingId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(data => {
      if (!data.success) navigate('/frontofficelogin');
      setLoading(false);
    });
  }, [navigate]);

  const handleCheckIn = async () => {
    try {
      const res = await axios.post(`/frontdesk/checkin/${bookingId}`, {}, {
        headers: { 'x-access-token': localStorage.getItem('token') }
      });
      setMessage('Checked in successfully!');
    } catch (err) {
      setMessage('Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await axios.post(`/frontdesk/checkout/${bookingId}`, {}, {
        headers: { 'x-access-token': localStorage.getItem('token') }
      });
      setMessage('Checked out successfully!');
    } catch (err) {
      setMessage('Check-out failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>Check In/Out</h2>
      <div style={styles.form}>
        <input
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />
        <button onClick={handleCheckIn}>Check In</button>
        <button onClick={handleCheckOut}>Check Out</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }
};

export default Check;
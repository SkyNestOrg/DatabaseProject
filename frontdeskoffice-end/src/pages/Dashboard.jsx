import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import checkAuth from '../checkAuth';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ guestId: '', roomNumber: '', checkinDate: '', checkoutDate: '', bill: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const data = await checkAuth();
      if (!data.success) return navigate('/frontofficelogin');
      setUser(JSON.parse(localStorage.getItem('user')));
      
      try {
        const res = await axios.get('/frontdesk/bookings/bookings', {
          headers: { 'x-access-token': localStorage.getItem('token') }
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.log('No bookings endpoint yet');
      }
    };
    init();
  }, [navigate]);

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/frontdesk/bookings/booking', formData, {
        headers: { 'x-access-token': localStorage.getItem('token') }
      });
      setMessage('Booking created!');
      setFormData({ guestId: '', roomNumber: '', checkinDate: '', checkoutDate: '', bill: '' });
    } catch (err) {
      setMessage('Error creating booking');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/frontofficelogin');
  };

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1>Front Desk Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <nav style={styles.sidebar}>
        <button onClick={() => navigate('/check')}>Check In/Out</button>
        <button onClick={() => navigate('/payment')}>Payment</button>
        <button onClick={() => navigate('/searchguestdetails')}>Search Guest</button>
      </nav>

      <main style={styles.main}>
        <h2>Welcome, {user?.username}!</h2>
        
        <form onSubmit={handleCreateBooking} style={styles.form}>
          <h3>Create Booking</h3>
          <input placeholder="Guest ID" value={formData.guestId} onChange={(e) => setFormData({...formData, guestId: e.target.value})} />
          <input placeholder="Room #" value={formData.roomNumber} onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} />
          <input type="date" value={formData.checkinDate} onChange={(e) => setFormData({...formData, checkinDate: e.target.value})} />
          <input type="date" value={formData.checkoutDate} onChange={(e) => setFormData({...formData, checkoutDate: e.target.value})} />
          <input type="number" placeholder="Bill $" value={formData.bill} onChange={(e) => setFormData({...formData, bill: e.target.value})} />
          <button type="submit">Create Booking</button>
        </form>

        {message && <p>{message}</p>}
        
        {bookings.length > 0 && (
          <table style={styles.table}>
            <thead><tr><th>ID</th><th>Guest</th><th>Room</th><th>Status</th></tr></thead>
            <tbody>{bookings.map(b => (
              <tr key={b.booking_id}><td>{b.booking_id}</td><td>{b.guestId}</td><td>{b.roomNumber}</td><td>{b.status}</td></tr>
            ))}</tbody>
          </table>
        )}
      </main>
    </div>
  );
}

const styles = {
  dashboard: { display: 'grid', gridTemplateColumns: '200px 1fr', height: '100vh' },
  header: { background: '#2c3e50', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between' },
  sidebar: { background: '#34495e', padding: '20px' }, 
  main: { padding: '20px', overflowY: 'auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px 0' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
};

export default Dashboard;
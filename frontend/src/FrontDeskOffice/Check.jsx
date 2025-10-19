// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import checkAuth from './checkAuth';

// function Check() {
//   const [bookingId, setBookingId] = useState('');
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     checkAuth().then(data => {
//       if (!data.success) navigate('/frontofficelogin');
//       setLoading(false);
//     });
//   }, [navigate]);

//   const fetchBookingDetails = async () => {
//     if (!bookingId || isNaN(bookingId)) {
//       setBookingDetails(null);
//       setMessage('Please enter a valid booking ID');
//       return;
//     }
//     try {
//       const res = await axios.get(`/frontdesk/fetch/${bookingId}`, {
//         headers: { 'x-access-token': localStorage.getItem('token') }
//       });
//       if (res.data.success) {
//         setBookingDetails(res.data.booking);
//         setMessage('');
//       } else {
//         setMessage('Booking not found');
//         setBookingDetails(null);
//       }
//     } catch (err) {
//       setMessage('Failed to fetch booking details');
//       setBookingDetails(null);
//     }
//   };

//   const handleCheckIn = async () => {
//     if (!bookingDetails) return;
//     try {
//       const res = await axios.post(`/frontdesk/checkin`, { booking_id: bookingId }, {
//         headers: { 'x-access-token': localStorage.getItem('token') }
//       });
//       if (res.data.success) {
//         setMessage('Checked in successfully!');
//         fetchBookingDetails(); // Refresh details
//       } else {
//         setMessage(res.data.message || 'Check-in failed');
//       }
//     } catch (err) {
//       setMessage('Check-in failed');
//     }
//   };

//   const handleCheckOut = async () => {
//     if (!bookingDetails || bookingDetails.booking_status === 'checked-out') return;
//     try {
//       const res = await axios.post(`/frontdesk/checkout/${bookingId}`, {}, {
//         headers: { 'x-access-token': localStorage.getItem('token') }
//       });
//       if (res.data.success) {
//         setMessage('Checked out successfully!');
//         setBookingDetails({ ...bookingDetails, booking_status: 'checked-out' });
//       } else {
//         setMessage(res.data.message || 'Check-out failed');
//       }
//     } catch (err) {
//       setMessage('Check-out failed');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Check In/Out</h1>

//       <div className="flex flex-col gap-4 w-full max-w-md">
//         <input
//           type="number"
//           placeholder="Booking ID"
//           value={bookingId}
//           onChange={(e) => setBookingId(e.target.value)}
//           className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={fetchBookingDetails}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//         >
//           Fetch Details
//         </button>
//       </div>

//       {bookingDetails && (
//         <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-md">
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">Booking Details</h2>

//           <p><strong>Guest:</strong> {bookingDetails.guest_name}</p>
//           <p><strong>Phone:</strong> {bookingDetails.phone_number}</p>
//           <p><strong>Email:</strong> {bookingDetails.email}</p>
//           <p><strong>Booking Date:</strong> {bookingDetails.booking_date}</p>
//           <p><strong>Check-in:</strong> {bookingDetails.check_in}</p>
//           <p><strong>Check-out:</strong> {bookingDetails.check_out}</p>
//           <p><strong>Status:</strong> {bookingDetails.booking_status}</p>
//           <p><strong>Branch:</strong> {bookingDetails.branch_name} ({bookingDetails.city})</p>
//           <p><strong>Branch Contact:</strong> {bookingDetails.branch_contact}</p>
//           <p><strong>Number of Rooms:</strong> {bookingDetails.number_of_rooms}</p>
//           <p><strong>Room Numbers:</strong> {bookingDetails.room_numbers}</p>
//           <p><strong>Room Types:</strong> {bookingDetails.room_types}</p>

//           <div className="mt-4 flex gap-4">
//             <button
//               onClick={handleCheckIn}
//               className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
//               disabled={bookingDetails.booking_status === 'CheckedIn'}
//             >
//               Check In
//             </button>
//             <button
//               onClick={handleCheckOut}
//               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
//               disabled={bookingDetails.booking_status === 'checked-out'}
//             >
//               Check Out
//             </button>
//           </div>
//         </div>
//       )}

//       {message && (
//         <p className={`mt-4 p-2 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//           {message}
//         </p>
//       )}
//     </div>
//   );
// }

// export default Check;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import checkAuth from './checkAuth';

function Check() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [searchBookingId, setSearchBookingId] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth().then(data => {
            if (!data.success) {
                navigate('/login');
            } else {
                const userData = localStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
                fetchBookings();
            }
            setLoading(false);
        });
    }, [navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get('http://localhost:5000/frontdesk/fetch', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-access-token': token
                }
            });

            if (response.data.success) {
                setBookings(response.data.bookings || response.data.data);
                setFilteredBookings(response.data.bookings || response.data.data);
                setError('');
            } else {
                setError(response.data.message || 'Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(error.response?.data?.message || 'Failed to load bookings');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        // Clear previous messages when searching
        setMessage('');
        setError('');

        if (!searchBookingId.trim()) {
            setFilteredBookings(bookings);
            return;
        }

        try {
            setSearchLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get(
                `http://localhost:5000/frontdesk/fetch/${searchBookingId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-access-token': token
                    }
                }
            );

            if (response.data.success) {
                setFilteredBookings([response.data.booking || response.data.data]);
                setError('');
            } else {
                setError(response.data.message || 'Booking not found');
                setFilteredBookings([]);
            }
        } catch (error) {
            console.error('Error searching booking:', error);
            if (error.response?.status === 404) {
                setError('Booking not found or does not belong to your branch');
                setFilteredBookings([]);
            } else if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(error.response?.data?.message || 'Failed to search booking');
            }
        } finally {
            setSearchLoading(false);
        }
    };

    const handleCheckIn = async (bookingId) => {
        if (!bookingId) return;
        
        try {
            setUpdatingStatus(bookingId);
            setMessage('');
            const token = localStorage.getItem('token');
            
            const res = await axios.post(
                `http://localhost:5000/frontdesk/checkin`, 
                { booking_id: bookingId }, 
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'x-access-token': token 
                    }
                }
            );
            
            if (res.data.success) {
                setMessage('Checked in successfully!');
                
                // Update the booking status in both bookings and filteredBookings
                const updatedBookings = bookings.map(booking =>
                    booking.booking_id === bookingId 
                        ? { ...booking, booking_status: 'CheckedIn', status: 'CheckedIn' }
                        : booking
                );
                
                const updatedFilteredBookings = filteredBookings.map(booking =>
                    booking.booking_id === bookingId 
                        ? { ...booking, booking_status: 'CheckedIn', status: 'CheckedIn' }
                        : booking
                );
                
                setBookings(updatedBookings);
                setFilteredBookings(updatedFilteredBookings);
                
                // Auto-clear success message after 3 seconds
                setTimeout(() => {
                    setMessage('');
                }, 3000);
                
            } else {
                setMessage(res.data.message || 'Check-in failed');
            }
        } catch (err) {
            console.error('Check-in error:', err);
            setMessage('Check-in failed');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleCheckOut = async (bookingId) => {
        if (!bookingId) return;
        
        try {
            setUpdatingStatus(bookingId);
            setMessage('');
            const token = localStorage.getItem('token');
            
            const res = await axios.post(
                `http://localhost:5000/frontdesk/checkout/${bookingId}`, 
                {}, 
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'x-access-token': token 
                    }
                }
            );
            
            if (res.data.success) {
                setMessage('Checked out successfully!');
                
                // Update the booking status in both bookings and filteredBookings
                const updatedBookings = bookings.map(booking =>
                    booking.booking_id === bookingId 
                        ? { ...booking, booking_status: 'CheckedOut', status: 'CheckedOut' }
                        : booking
                );
                
                const updatedFilteredBookings = filteredBookings.map(booking =>
                    booking.booking_id === bookingId 
                        ? { ...booking, booking_status: 'CheckedOut', status: 'CheckedOut' }
                        : booking
                );
                
                setBookings(updatedBookings);
                setFilteredBookings(updatedFilteredBookings);
                
                // Auto-clear success message after 3 seconds
                setTimeout(() => {
                    setMessage('');
                }, 3000);
                
            } else {
                setMessage(res.data.message || 'Check-out failed');
            }
        } catch (err) {
            console.error('Check-out error:', err);
            setMessage('Check-out failed');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleClearSearch = () => {
        setSearchBookingId('');
        setFilteredBookings(bookings);
        setError('');
        setMessage('');
    };

    // Auto-clear messages when search booking ID changes
    useEffect(() => {
        setMessage('');
        setError('');
    }, [searchBookingId]);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        return new Date(dateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const actualStatus = status?.booking_status || status;
        switch (actualStatus) {
            case 'Confirmed':
                return '#3498db';
            case 'CheckedIn':
                return '#27ae60';
            case 'CheckedOut':
                return '#95a5a6';
            case 'Cancelled':
                return '#e74c3c';
            default:
                return '#7f8c8d';
        }
    };

    const getCurrentStatus = (booking) => {
        return booking.booking_status || booking.status || 'Confirmed';
    };

    const isFinalStatus = (status) => {
        const actualStatus = status?.booking_status || status;
        return actualStatus === 'CheckedOut' || actualStatus === 'Cancelled';
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Loading bookings...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Manage Bookings - Branch {user?.branch_id}</h1>
                <button onClick={fetchBookings} style={styles.refreshBtn}>
                    Refresh
                </button>
            </div>

            <div style={styles.searchSection}>
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by Booking ID..."
                        value={searchBookingId}
                        onChange={(e) => setSearchBookingId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={styles.searchInput}
                    />
                    <button 
                        onClick={handleSearch} 
                        style={styles.searchBtn}
                        disabled={searchLoading}
                    >
                        {searchLoading ? 'Searching...' : 'Search'}
                    </button>
                    {searchBookingId && (
                        <button 
                            onClick={handleClearSearch} 
                            style={styles.clearBtn}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div style={styles.errorMessage}>
                    {error}
                    <button 
                        onClick={() => setError('')} 
                        style={styles.closeMessageBtn}
                    >
                        ×
                    </button>
                </div>
            )}

            {message && (
                <div style={{
                    ...styles.message,
                    backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
                    color: message.includes('successfully') ? '#155724' : '#721c24',
                    border: message.includes('successfully') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                }}>
                    {message}
                    <button 
                        onClick={() => setMessage('')} 
                        style={styles.closeMessageBtn}
                    >
                        ×
                    </button>
                </div>
            )}

            {filteredBookings.length === 0 ? (
                <div style={styles.noBookings}>
                    <h3>No bookings found</h3>
                    <p>No bookings match your search criteria.</p>
                </div>
            ) : (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Booking ID</th>
                                <th style={styles.th}>Guest Name</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Booking Date</th>
                                <th style={styles.th}>Check-in</th>
                                <th style={styles.th}>Check-out</th>
                                <th style={styles.th}>Rooms</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => {
                                const currentStatus = getCurrentStatus(booking);
                                const isFinal = isFinalStatus(booking);
                                
                                return (
                                    <tr key={booking.booking_id} style={styles.tr}>
                                        <td style={styles.td}>#{booking.booking_id}</td>
                                        <td style={styles.td}>{booking.guest_name}</td>
                                        <td style={styles.td}>{booking.phone_number}</td>
                                        <td style={styles.td}>{booking.email}</td>
                                        <td style={{...styles.td, ...styles.datetime}}>
                                            {formatDateTime(booking.booking_date)}
                                        </td>
                                        <td style={{...styles.td, ...styles.datetime}}>
                                            {formatDateTime(booking.check_in)}
                                        </td>
                                        <td style={{...styles.td, ...styles.datetime}}>
                                            {formatDateTime(booking.check_out)}
                                        </td>
                                        <td style={{...styles.td, ...styles.center}}>
                                            {booking.number_of_rooms}
                                            {booking.room_numbers && ` (${booking.room_numbers})`}
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: getStatusColor(booking)
                                            }}>
                                                {currentStatus}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actionButtons}>
                                                <button
                                                    onClick={() => handleCheckIn(booking.booking_id)}
                                                    disabled={currentStatus === 'CheckedIn' || currentStatus === 'CheckedOut' || currentStatus === 'Cancelled' || updatingStatus === booking.booking_id}
                                                    style={{
                                                        ...styles.checkInBtn,
                                                        opacity: (currentStatus === 'CheckedIn' || currentStatus === 'CheckedOut' || currentStatus === 'Cancelled' || updatingStatus === booking.booking_id) ? 0.6 : 1
                                                    }}
                                                >
                                                    {updatingStatus === booking.booking_id ? 'Processing...' : 'Check In'}
                                                </button>
                                                <button
                                                    onClick={() => handleCheckOut(booking.booking_id)}
                                                    disabled={currentStatus !== 'CheckedIn' || updatingStatus === booking.booking_id}
                                                    style={{
                                                        ...styles.checkOutBtn,
                                                        opacity: (currentStatus !== 'CheckedIn' || updatingStatus === booking.booking_id) ? 0.6 : 1
                                                    }}
                                                >
                                                    {updatingStatus === booking.booking_id ? 'Processing...' : 'Check Out'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #e0e0e0',
    },
    refreshBtn: {
        background: '#3498db',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background 0.3s ease',
    },
    searchSection: {
        marginBottom: '2rem',
        padding: '1.5rem',
        background: '#f8f9fa',
        borderRadius: '8px',
    },
    searchContainer: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    searchInput: {
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        minWidth: '250px',
        flex: '1',
    },
    searchBtn: {
        background: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    clearBtn: {
        background: '#95a5a6',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    errorMessage: {
        background: '#f8d7da',
        color: '#721c24',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        border: '1px solid #f5c6cb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    message: {
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        border: '1px solid',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeMessageBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: 'inherit',
        padding: '0',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noBookings: {
        textAlign: 'center',
        padding: '3rem',
        background: '#f8f9fa',
        borderRadius: '10px',
        color: '#6c757d',
    },
    tableContainer: {
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1000px',
    },
    th: {
        background: '#34495e',
        color: 'white',
        padding: '1rem',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '0.9rem',
    },
    td: {
        padding: '1rem',
        borderBottom: '1px solid #e0e0e0',
        verticalAlign: 'top',
    },
    tr: {
        ':hover': {
            background: '#f8f9fa',
        },
    },
    datetime: {
        fontSize: '0.9rem',
        color: '#7f8c8d',
        whiteSpace: 'nowrap',
    },
    center: {
        textAlign: 'center',
    },
    statusBadge: {
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        color: 'white',
        textTransform: 'uppercase',
        display: 'inline-block',
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        minWidth: '120px',
    },
    checkInBtn: {
        background: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background 0.3s ease',
    },
    checkOutBtn: {
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background 0.3s ease',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: '#7f8c8d',
    },
};

// Add hover effects
styles.refreshBtn = {
    ...styles.refreshBtn,
    ':hover': {
        background: '#2980b9',
    },
};

styles.searchBtn = {
    ...styles.searchBtn,
    ':hover': {
        background: '#219653',
    },
};

styles.clearBtn = {
    ...styles.clearBtn,
    ':hover': {
        background: '#7f8c8d',
    },
};

styles.checkInBtn = {
    ...styles.checkInBtn,
    ':hover': {
        background: '#219653',
    },
};

styles.checkOutBtn = {
    ...styles.checkOutBtn,
    ':hover': {
        background: '#c0392b',
    },
};

styles.closeMessageBtn = {
    ...styles.closeMessageBtn,
    ':hover': {
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '50%',
    },
};

export default Check;
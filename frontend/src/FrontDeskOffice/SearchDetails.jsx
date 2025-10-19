import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import checkAuth from './checkAuth';

function SearchGuestDetails() {
  const [bookingId, setBookingId] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(data => {
      if (!data.success) navigate('/frontofficelogin');
      else {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
      }
    });
  }, [navigate]);

  const handleSearch = async () => {
    if (!bookingId || isNaN(bookingId)) {
      setError('Please enter a valid booking ID');
      setBookingDetails(null);
      return;
    }

    try {
      setSearchLoading(true);
      setError('');
      setMessage('');
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`/frontdesk/fetch/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-access-token': token
        }
      });

      if (response.data.success) {
        setBookingDetails(response.data.booking);
        setMessage('Booking details fetched successfully!');
      } else {
        setError(response.data.message || 'Booking not found');
        setBookingDetails(null);
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
      if (err.response?.status === 404) {
        setError('Booking not found');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/frontofficelogin'), 2000);
      } else {
        setError('Failed to fetch booking details');
      }
      setBookingDetails(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClear = () => {
    setBookingId('');
    setBookingDetails(null);
    setMessage('');
    setError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
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

  // Function to parse room numbers and types into arrays
  const parseRoomDetails = (booking) => {
    if (!booking) return { roomNumbers: [], roomTypes: [] };
    
    const roomNumbers = booking.room_numbers ? 
      booking.room_numbers.split(', ').filter(room => room.trim() !== '') : [];
    
    const roomTypes = booking.room_types ? 
      booking.room_types.split(', ').filter(type => type.trim() !== '') : [];
    
    return { roomNumbers, roomTypes };
  };

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #e0e0e0',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      margin: 0
    },
    backButton: {
      background: '#95a5a6',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
    },
    searchSection: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
    },
    searchTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#2c3e50',
    },
    searchRow: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    searchInput: {
      flex: '1',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '1rem',
      minWidth: '250px',
    },
    searchButton: {
      padding: '0.75rem 1.5rem',
      background: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
    },
    clearButton: {
      padding: '0.75rem 1.5rem',
      background: '#95a5a6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
    },
    message: {
      padding: '1rem',
      borderRadius: '6px',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    successMessage: {
      background: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    errorMessage: {
      background: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
    bookingCard: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#2c3e50',
      borderBottom: '2px solid #3498db',
      paddingBottom: '0.5rem',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem',
    },
    infoCard: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#34495e',
    },
    infoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 0',
      borderBottom: '1px solid #ecf0f1',
    },
    infoLabel: {
      fontWeight: '600',
      color: '#2c3e50',
    },
    infoValue: {
      color: '#34495e',
    },
    statusBadge: {
      padding: '0.4rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: 'white',
      textTransform: 'uppercase',
    },
    roomTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1rem',
    },
    roomTableHeader: {
      backgroundColor: '#34495e',
      color: 'white',
      padding: '1rem',
      textAlign: 'left',
      fontWeight: '600',
    },
    roomTableRow: {
      borderBottom: '1px solid #ecf0f1',
    },
    roomTableCell: {
      padding: '1rem',
      textAlign: 'left',
    },
    roomTypeBadge: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '0.3rem 0.8rem',
      borderRadius: '15px',
      fontSize: '0.8rem',
      fontWeight: '600',
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.2rem',
      color: '#7f8c8d',
    },
    noResults: {
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      color: '#6c757d',
    },
  };

  const { roomNumbers, roomTypes } = parseRoomDetails(bookingDetails);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Search Guest Details</h1>
        <button
          style={styles.backButton}
          onClick={() => navigate('/frontdesk/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={styles.searchSection}>
        <h3 style={styles.searchTitle}>Search by Booking ID</h3>
        <div style={styles.searchRow}>
          <input
            type="number"
            placeholder="Enter Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={styles.searchInput}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            style={styles.searchButton}
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
          {(bookingId || bookingDetails) && (
            <button
              onClick={handleClear}
              style={styles.clearButton}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {message && (
        <div style={{ ...styles.message, ...styles.successMessage }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ ...styles.message, ...styles.errorMessage }}>
          {error}
        </div>
      )}

      {searchLoading && (
        <div style={styles.loading}>
          Searching for booking details...
        </div>
      )}

      {bookingDetails && !searchLoading && (
        <div style={styles.bookingCard}>
          <h2 style={styles.sectionTitle}>Booking & Guest Details</h2>
          
          <div style={styles.infoGrid}>
            {/* Guest Information */}
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>Guest Information</h3>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Full Name:</span>
                <span style={styles.infoValue}>{bookingDetails.guest_name}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Phone Number:</span>
                <span style={styles.infoValue}>{bookingDetails.phone_number}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Email:</span>
                <span style={styles.infoValue}>{bookingDetails.email}</span>
              </div>
            </div>

            {/* Booking Information */}
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>Booking Information</h3>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Booking ID:</span>
                <span style={styles.infoValue}>#{bookingDetails.booking_id}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Booking Date:</span>
                <span style={styles.infoValue}>{formatDate(bookingDetails.booking_date)}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Status:</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(bookingDetails.booking_status)
                  }}
                >
                  {bookingDetails.booking_status}
                </span>
              </div>
            </div>

            {/* Stay Details */}
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>Stay Details</h3>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Check-in:</span>
                <span style={styles.infoValue}>{formatDate(bookingDetails.check_in)}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Check-out:</span>
                <span style={styles.infoValue}>{formatDate(bookingDetails.check_out)}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Number of Rooms:</span>
                <span style={styles.infoValue}>{bookingDetails.number_of_rooms}</span>
              </div>
            </div>

            {/* Branch Information */}
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>Branch Information</h3>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Branch Name:</span>
                <span style={styles.infoValue}>{bookingDetails.branch_name}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>City:</span>
                <span style={styles.infoValue}>{bookingDetails.city}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Contact:</span>
                <span style={styles.infoValue}>{bookingDetails.branch_contact}</span>
              </div>
            </div>
          </div>

          {/* Room Details Section */}
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Room Details</h3>
            {roomNumbers.length > 0 && roomTypes.length > 0 ? (
              <table style={styles.roomTable}>
                <thead>
                  <tr>
                    <th style={styles.roomTableHeader}>Room Number</th>
                    <th style={styles.roomTableHeader}>Room Type</th>
                  </tr>
                </thead>
                <tbody>
                  {roomNumbers.map((roomNumber, index) => (
                    <tr key={index} style={styles.roomTableRow}>
                      <td style={styles.roomTableCell}>
                        <strong>{roomNumber}</strong>
                      </td>
                      <td style={styles.roomTableCell}>
                        <span style={styles.roomTypeBadge}>
                          {roomTypes[index] || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem' }}>
                No room details available
              </div>
            )}
          </div>
        </div>
      )}

      {!bookingDetails && !searchLoading && bookingId && (
        <div style={styles.noResults}>
          <h3>No booking found</h3>
          <p>No booking details found for the provided Booking ID.</p>
        </div>
      )}
    </div>
  );
}

export default SearchGuestDetails;
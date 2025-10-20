// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import checkAuth from './checkAuth';

// function SearchGuestDetails() {
//   const [bookingId, setBookingId] = useState('');
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     checkAuth().then(data => {
//       if (!data.success) navigate('/login');
//       else {
//         const userData = localStorage.getItem('user');
//         if (userData) setUser(JSON.parse(userData));
//       }
//     });
//   }, [navigate]);

//   const handleSearch = async () => {
//     if (!bookingId || isNaN(bookingId)) {
//       setError('Please enter a valid booking ID');
//       setBookingDetails(null);
//       return;
//     }

//     try {
//       setSearchLoading(true);
//       setError('');
//       setMessage('');
      
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`/frontdesk/searchguestdetails/${bookingId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'x-access-token': token
//         }
//       });

//       if (response.data.success) {
//         setBookingDetails(response.data.booking);
//         setMessage('Booking details fetched successfully!');
//       } else {
//         setError(response.data.message || 'Booking not found');
//         setBookingDetails(null);
//       }
//     } catch (err) {
//       console.error('Error fetching booking details:', err);
//       if (err.response?.status === 404) {
//         setError('Booking not found');
//       } else if (err.response?.status === 401) {
//         setError('Session expired. Please login again.');
//         setTimeout(() => navigate('/frontofficelogin'), 2000);
//       } else {
//         setError('Failed to fetch booking details');
//       }
//       setBookingDetails(null);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setBookingId('');
//     setBookingDetails(null);
//     setMessage('');
//     setError('');
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Confirmed':
//         return '#3498db';
//       case 'CheckedIn':
//         return '#27ae60';
//       case 'CheckedOut':
//         return '#95a5a6';
//       case 'Cancelled':
//         return '#e74c3c';
//       default:
//         return '#7f8c8d';
//     }
//   };

//   // Function to parse room numbers and types into arrays
//   const parseRoomDetails = (booking) => {
//     if (!booking) return { roomNumbers: [], roomTypes: [] };
    
//     const roomNumbers = booking.room_numbers ? 
//       booking.room_numbers.split(', ').filter(room => room.trim() !== '') : [];
    
//     const roomTypes = booking.room_types ? 
//       booking.room_types.split(', ').filter(type => type.trim() !== '') : [];
    
//     return { roomNumbers, roomTypes };
//   };

//   const styles = {
//     container: {
//       padding: '2rem',
//       maxWidth: '1200px',
//       margin: '0 auto',
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       backgroundColor: '#f8f9fa',
//       minHeight: '100vh'
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '2rem',
//       paddingBottom: '1rem',
//       borderBottom: '2px solid #e0e0e0',
//     },
//     title: {
//       fontSize: '2.5rem',
//       fontWeight: 'bold',
//       color: '#2c3e50',
//       margin: 0
//     },
//     backButton: {
//       background: '#95a5a6',
//       color: 'white',
//       border: 'none',
//       padding: '0.75rem 1.5rem',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontSize: '1rem',
//       fontWeight: '600',
//     },
//     searchSection: {
//       backgroundColor: 'white',
//       padding: '2rem',
//       borderRadius: '10px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//       marginBottom: '2rem',
//     },
//     searchTitle: {
//       fontSize: '1.5rem',
//       fontWeight: 'bold',
//       marginBottom: '1.5rem',
//       color: '#2c3e50',
//     },
//     searchRow: {
//       display: 'flex',
//       gap: '1rem',
//       alignItems: 'center',
//       flexWrap: 'wrap',
//     },
//     searchInput: {
//       flex: '1',
//       padding: '0.75rem',
//       border: '1px solid #ddd',
//       borderRadius: '6px',
//       fontSize: '1rem',
//       minWidth: '250px',
//     },
//     searchButton: {
//       padding: '0.75rem 1.5rem',
//       background: '#3498db',
//       color: 'white',
//       border: 'none',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontSize: '1rem',
//       fontWeight: '600',
//     },
//     clearButton: {
//       padding: '0.75rem 1.5rem',
//       background: '#95a5a6',
//       color: 'white',
//       border: 'none',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontSize: '1rem',
//       fontWeight: '600',
//     },
//     message: {
//       padding: '1rem',
//       borderRadius: '6px',
//       marginBottom: '1rem',
//       textAlign: 'center',
//     },
//     successMessage: {
//       background: '#d4edda',
//       color: '#155724',
//       border: '1px solid #c3e6cb',
//     },
//     errorMessage: {
//       background: '#f8d7da',
//       color: '#721c24',
//       border: '1px solid #f5c6cb',
//     },
//     bookingCard: {
//       backgroundColor: 'white',
//       padding: '2rem',
//       borderRadius: '10px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//     },
//     sectionTitle: {
//       fontSize: '1.8rem',
//       fontWeight: 'bold',
//       marginBottom: '1.5rem',
//       color: '#2c3e50',
//       borderBottom: '2px solid #3498db',
//       paddingBottom: '0.5rem',
//     },
//     infoGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//       gap: '2rem',
//       marginBottom: '2rem',
//     },
//     infoCard: {
//       backgroundColor: '#f8f9fa',
//       padding: '1.5rem',
//       borderRadius: '8px',
//       border: '1px solid #e0e0e0',
//     },
//     cardTitle: {
//       fontSize: '1.2rem',
//       fontWeight: '600',
//       marginBottom: '1rem',
//       color: '#34495e',
//     },
//     infoItem: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '0.5rem 0',
//       borderBottom: '1px solid #ecf0f1',
//     },
//     infoLabel: {
//       fontWeight: '600',
//       color: '#2c3e50',
//     },
//     infoValue: {
//       color: '#34495e',
//     },
//     statusBadge: {
//       padding: '0.4rem 1rem',
//       borderRadius: '20px',
//       fontSize: '0.9rem',
//       fontWeight: '600',
//       color: 'white',
//       textTransform: 'uppercase',
//     },
//     roomTable: {
//       width: '100%',
//       borderCollapse: 'collapse',
//       marginTop: '1rem',
//     },
//     roomTableHeader: {
//       backgroundColor: '#34495e',
//       color: 'white',
//       padding: '1rem',
//       textAlign: 'left',
//       fontWeight: '600',
//     },
//     roomTableRow: {
//       borderBottom: '1px solid #ecf0f1',
//     },
//     roomTableCell: {
//       padding: '1rem',
//       textAlign: 'left',
//     },
//     roomTypeBadge: {
//       backgroundColor: '#3498db',
//       color: 'white',
//       padding: '0.3rem 0.8rem',
//       borderRadius: '15px',
//       fontSize: '0.8rem',
//       fontWeight: '600',
//     },
//     loading: {
//       textAlign: 'center',
//       padding: '2rem',
//       fontSize: '1.2rem',
//       color: '#7f8c8d',
//     },
//     noResults: {
//       textAlign: 'center',
//       padding: '3rem',
//       backgroundColor: 'white',
//       borderRadius: '10px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//       color: '#6c757d',
//     },
//   };

//   const { roomNumbers, roomTypes } = parseRoomDetails(bookingDetails);

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.title}>Search Guest Details</h1>
//         <button
//           style={styles.backButton}
//           onClick={() => navigate('/frontdesk/dashboard')}
//         >
//           Back to Dashboard
//         </button>
//       </div>

//       <div style={styles.searchSection}>
//         <h3 style={styles.searchTitle}>Search by Booking ID</h3>
//         <div style={styles.searchRow}>
//           <input
//             type="number"
//             placeholder="Enter Booking ID"
//             value={bookingId}
//             onChange={(e) => setBookingId(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             style={styles.searchInput}
//           />
//           <button
//             onClick={handleSearch}
//             disabled={searchLoading}
//             style={styles.searchButton}
//           >
//             {searchLoading ? 'Searching...' : 'Search'}
//           </button>
//           {(bookingId || bookingDetails) && (
//             <button
//               onClick={handleClear}
//               style={styles.clearButton}
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {message && (
//         <div style={{ ...styles.message, ...styles.successMessage }}>
//           {message}
//         </div>
//       )}

//       {error && (
//         <div style={{ ...styles.message, ...styles.errorMessage }}>
//           {error}
//         </div>
//       )}

//       {searchLoading && (
//         <div style={styles.loading}>
//           Searching for booking details...
//         </div>
//       )}

//       {bookingDetails && !searchLoading && (
//         <div style={styles.bookingCard}>
//           <h2 style={styles.sectionTitle}>Booking & Guest Details</h2>
          
//           <div style={styles.infoGrid}>
//             {/* Guest Information */}
//             <div style={styles.infoCard}>
//               <h3 style={styles.cardTitle}>Guest Information</h3>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Full Name:</span>
//                 <span style={styles.infoValue}>{bookingDetails.guest_name}</span>
//               </div>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Phone Number:</span>
//                 <span style={styles.infoValue}>{bookingDetails.phone_number}</span>
//               </div>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Email:</span>
//                 <span style={styles.infoValue}>{bookingDetails.email}</span>
//               </div>
//             </div>

//             {/* Booking Information */}
//             <div style={styles.infoCard}>
//               <h3 style={styles.cardTitle}>Booking Information</h3>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Booking ID:</span>
//                 <span style={styles.infoValue}>#{bookingDetails.booking_id}</span>
//               </div>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Booking Date:</span>
//                 <span style={styles.infoValue}>{formatDate(bookingDetails.booking_date)}</span>
//               </div>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Status:</span>
//                 <span
//                   style={{
//                     ...styles.statusBadge,
//                     backgroundColor: getStatusColor(bookingDetails.booking_status)
//                   }}
//                 >
//                   {bookingDetails.booking_status}
//                 </span>
//               </div>
//             </div>

//             {/* Stay Details */}
//             <div style={styles.infoCard}>
//               <h3 style={styles.cardTitle}>Stay Details</h3>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Check-in:</span>
//                 <span style={styles.infoValue}>{formatDate(bookingDetails.check_in)}</span>
//               </div>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Check-out:</span>
//                 <span style={styles.infoValue}>{formatDate(bookingDetails.check_out)}</span>
//               </div>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Number of Rooms:</span>
//                 <span style={styles.infoValue}>{bookingDetails.number_of_rooms}</span>
//               </div>
//             </div>

//             {/* Branch Information */}
//             <div style={styles.infoCard}>
//               <h3 style={styles.cardTitle}>Branch Information</h3>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Branch Name:</span>
//                 <span style={styles.infoValue}>{bookingDetails.branch_name}</span>
//               </div>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>City:</span>
//                 <span style={styles.infoValue}>{bookingDetails.city}</span>
//               </div>
//               <div style={styles.infoItem}>
//                 <span style={styles.infoLabel}>Contact:</span>
//                 <span style={styles.infoValue}>{bookingDetails.branch_contact}</span>
//               </div>
//             </div>
//           </div>

//           {/* Room Details Section */}
//           <div style={styles.infoCard}>
//             <h3 style={styles.cardTitle}>Room Details</h3>
//             {roomNumbers.length > 0 && roomTypes.length > 0 ? (
//               <table style={styles.roomTable}>
//                 <thead>
//                   <tr>
//                     <th style={styles.roomTableHeader}>Room Number</th>
//                     <th style={styles.roomTableHeader}>Room Type</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {roomNumbers.map((roomNumber, index) => (
//                     <tr key={index} style={styles.roomTableRow}>
//                       <td style={styles.roomTableCell}>
//                         <strong>{roomNumber}</strong>
//                       </td>
//                       <td style={styles.roomTableCell}>
//                         <span style={styles.roomTypeBadge}>
//                           {roomTypes[index] || 'N/A'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem' }}>
//                 No room details available
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {!bookingDetails && !searchLoading && bookingId && (
//         <div style={styles.noResults}>
//           <h3>No booking found</h3>
//           <p>No booking details found for the provided Booking ID.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SearchGuestDetails;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import checkAuth from './checkAuth';

function SearchGuestDetails() {
  const [searchParams, setSearchParams] = useState({
    guest_id: '',
    first_name: '',
    last_name: ''
  });
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(data => {
      if (!data.success) navigate('/login');
      else {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
      }
    });
  }, [navigate]);

  const handleSearch = async () => {
    // Check if at least one search parameter is provided
    if (!searchParams.guest_id && !searchParams.first_name && !searchParams.last_name) {
      setError('Please provide at least one search criteria (Guest ID, First Name, or Last Name)');
      setGuests([]);
      return;
    }

    try {
      setSearchLoading(true);
      setError('');
      setMessage('');
      
      const token = localStorage.getItem('token');
      const response = await axios.post('/frontdesk/searchguestdetails', searchParams, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-access-token': token
        }
      });

      if (response.data.success) {
        setGuests(response.data.data || []);
        setMessage(response.data.message || `Found ${response.data.data?.length || 0} guest(s) matching your search`);
      } else {
        setError(response.data.message || 'No guests found');
        setGuests([]);
      }
    } catch (err) {
      console.error('Error fetching guest details:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/frontofficelogin'), 2000);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch guest details');
      }
      setGuests([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClear = () => {
    setSearchParams({
      guest_id: '',
      first_name: '',
      last_name: ''
    });
    setGuests([]);
    setMessage('');
    setError('');
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    searchGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    inputLabel: {
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#2c3e50',
    },
    searchInput: {
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '1rem',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      flexWrap: 'wrap',
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
    guestCard: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
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
    bookingSection: {
      marginTop: '2rem',
    },
    bookingTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1rem',
    },
    bookingTableHeader: {
      backgroundColor: '#34495e',
      color: 'white',
      padding: '1rem',
      textAlign: 'left',
      fontWeight: '600',
    },
    bookingTableRow: {
      borderBottom: '1px solid #ecf0f1',
    },
    bookingTableCell: {
      padding: '1rem',
      textAlign: 'left',
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
        <h3 style={styles.searchTitle}>Search Guest by Details</h3>
        <div style={styles.searchGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Guest ID</label>
            <input
              type="number"
              placeholder="Enter Guest ID"
              value={searchParams.guest_id}
              onChange={(e) => handleInputChange('guest_id', e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>First Name</label>
            <input
              type="text"
              placeholder="Enter First Name"
              value={searchParams.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Last Name</label>
            <input
              type="text"
              placeholder="Enter Last Name"
              value={searchParams.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={styles.searchInput}
            />
          </div>
        </div>
        <div style={styles.buttonGroup}>
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            style={styles.searchButton}
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
          {(searchParams.guest_id || searchParams.first_name || searchParams.last_name || guests.length > 0) && (
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
          Searching for guest details...
        </div>
      )}

      {guests.length > 0 && !searchLoading && (
        <div>
          {guests.map((guest, index) => (
            <div key={guest.guest_id || index} style={styles.guestCard}>
              <h2 style={styles.sectionTitle}>
                Guest: {guest.first_name} {guest.last_name}
              </h2>
              
              <div style={styles.infoGrid}>
                {/* Guest Personal Information */}
                <div style={styles.infoCard}>
                  <h3 style={styles.cardTitle}>Personal Information</h3>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Guest ID:</span>
                    <span style={styles.infoValue}>#{guest.guest_id}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Full Name:</span>
                    <span style={styles.infoValue}>{guest.first_name} {guest.last_name}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Email:</span>
                    <span style={styles.infoValue}>{guest.email || 'N/A'}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Phone:</span>
                    <span style={styles.infoValue}>{guest.phone_number || 'N/A'}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Date of Birth:</span>
                    <span style={styles.infoValue}>{formatDate(guest.date_of_birth)}</span>
                  </div>
                </div>

                {/* Guest Address Information */}
                <div style={styles.infoCard}>
                  <h3 style={styles.cardTitle}>Address & Identification</h3>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Address:</span>
                    <span style={styles.infoValue}>{guest.address || 'N/A'}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Country:</span>
                    <span style={styles.infoValue}>{guest.country_of_residence || 'N/A'}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Passport Number:</span>
                    <span style={styles.infoValue}>{guest.passport_number || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div style={styles.bookingSection}>
                <h3 style={styles.cardTitle}>Booking History</h3>
                {guest.bookings && guest.bookings.length > 0 ? (
                  <table style={styles.bookingTable}>
                    <thead>
                      <tr>
                        <th style={styles.bookingTableHeader}>Booking ID</th>
                        <th style={styles.bookingTableHeader}>Booking Date</th>
                        <th style={styles.bookingTableHeader}>Branch</th>
                        <th style={styles.bookingTableHeader}>Check-in</th>
                        <th style={styles.bookingTableHeader}>Check-out</th>
                        <th style={styles.bookingTableHeader}>Rooms</th>
                        <th style={styles.bookingTableHeader}>Pax</th>
                        <th style={styles.bookingTableHeader}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guest.bookings.map((booking, bookingIndex) => (
                        <tr key={booking.booking_id || bookingIndex} style={styles.bookingTableRow}>
                          <td style={styles.bookingTableCell}>#{booking.booking_id}</td>
                          <td style={styles.bookingTableCell}>{formatDate(booking.booking_date)}</td>
                          <td style={styles.bookingTableCell}>{booking.branch_name || 'N/A'}</td>
                          <td style={styles.bookingTableCell}>{formatDate(booking.check_in)}</td>
                          <td style={styles.bookingTableCell}>{formatDate(booking.check_out)}</td>
                          <td style={styles.bookingTableCell}>{booking.number_of_rooms || 'N/A'}</td>
                          <td style={styles.bookingTableCell}>{booking.number_of_pax || 'N/A'}</td>
                          <td style={styles.bookingTableCell}>
                            <span
                              style={{
                                ...styles.statusBadge,
                                backgroundColor: getStatusColor(booking.status)
                              }}
                            >
                              {booking.status || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem' }}>
                    No booking history found for this guest
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!searchLoading && guests.length === 0 && (searchParams.guest_id || searchParams.first_name || searchParams.last_name) && (
        <div style={styles.noResults}>
          <h3>No guests found</h3>
          <p>No guest details found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}

export default SearchGuestDetails;
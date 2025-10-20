import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    completedServices: 0,
    pendingServices: 0,
    cancelledServices: 0
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const authToken = localStorage.getItem('token');

    if (userData && authToken) {
      setUser(JSON.parse(userData));
      fetchDashboardStats();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/serviceoffice/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setStats({
          totalRequests: response.data.totalRequests || 0,
          completedServices: response.data.completedServices || 0,
          pendingServices: response.data.pendingServices || 0,
          cancelledServices: response.data.cancelledServices || 0
        });
        setError('');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
  };

  const handleMenuItemClick = (item) => {
    if (item === "View Due Services") {
      navigate('/service/due');
    } else if (item === "View Service History") {
      navigate('/service/history');
    } else if (item === "Update Service Table") {
      navigate('/service/manage');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchDashboardStats();
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: '#2c3e50',
      fontWeight: 'bold',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
    },
  };

  const menuItems = [
    "View Due Services",
    "View Service History",
    "Update Service Table"
  ];

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <div style={styles.loading}>Redirecting to login...</div>;
  }

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div> ServiceOffice Dashboard</div>
        <div style={styles.userInfo}>
          <span>Welcome, {user.username}!</span>
          <button 
            style={styles.logoutButton} 
            onClick={handleLogout}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#1abc9c')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
              onClick={() => handleMenuItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>

      <main style={styles.content}>
        {error && (
          <div style={{
            color: '#e74c3c',
            backgroundColor: '#fadbd8',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            width: '100%',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Dashboard Statistics</h2>
            <button
              onClick={handleRefresh}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Refresh
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            width: '100%'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #3498db'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d', fontSize: '0.9rem' }}>Total Requests</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>{stats.totalRequests}</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #27ae60'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d', fontSize: '0.9rem' }}>Completed Services</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>{stats.completedServices}</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #f39c12'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d', fontSize: '0.9rem' }}>Pending Services</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>{stats.pendingServices}</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #e74c3c'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d', fontSize: '0.9rem' }}>Cancelled Services</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{stats.cancelledServices}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
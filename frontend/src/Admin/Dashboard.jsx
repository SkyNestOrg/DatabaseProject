import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalBranches: 0,
    totalGuests: 0,
    totalBookings: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch staff count
      const staffResponse = await axios.get('/managestaff', {
        headers: { 'x-access-token': token }
      });

      // Fetch branches count
      const branchesResponse = await axios.get('/managestaff/branches', {
        headers: { 'x-access-token': token }
      });

      // Fetch guests count
      const guestsResponse = await axios.get('/api/guests/count', {
        headers: { 'x-access-token': token }
      });

      // Fetch bookings count
      const bookingsResponse = await axios.get('/api/bookings/count', {
        headers: { 'x-access-token': token }
      });

      // Fetch recent logs
      const logsResponse = await axios.get('/viewlogs?limit=5', {
        headers: { 'x-access-token': token }
      });

      setStats({
        totalStaff: staffResponse.data.length,
        totalBranches: branchesResponse.data.length,
        totalGuests: guestsResponse.data.count || 0,
        totalBookings: bookingsResponse.data.count || 0
      });

      setRecentLogs(logsResponse.data.logs || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback to counting from available data
      try {
        const token = localStorage.getItem('token');
        const staffResponse = await axios.get('/managestaff', {
          headers: { 'x-access-token': token }
        });
        const branchesResponse = await axios.get('/managestaff/branches', {
          headers: { 'x-access-token': token }
        });

        setStats(prev => ({
          ...prev,
          totalStaff: staffResponse.data.length,
          totalBranches: branchesResponse.data.length
        }));
      } catch (fallbackError) {
        console.error('Fallback data fetch failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'registerStaff':
        navigate('/admin/manage-staff/create');
        break;
      case 'createDiscount':
        navigate('/admin/discounts');
        break;
      case 'manageTaxes':
        navigate('/admin/taxes');
        break;
      case 'viewLogs':
        navigate('/admin/logs');
        break;
      default:
        break;
    }
  };

  // If loading, show a loading spinner or message
  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div>Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  // Stats data for cards
  const statsData = [
    { title: 'Total Staff', value: stats.totalStaff, color: '#3498db' },
    { title: 'Total Branches', value: stats.totalBranches, color: '#2ecc71' },
    { title: 'Total Guests', value: stats.totalGuests, color: '#f39c12' },
    { title: 'Total Bookings', value: stats.totalBookings, color: '#e74c3c' }
  ];

  // Helper to format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <Layout>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '10px',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Hotel Overview</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
          Welcome to SkyNest Hotels management system. Monitor and manage all hotel operations from this dashboard.
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginTop: '30px'
        }}>
          {statsData.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: stat.color,
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>{stat.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Recent Activity</h3>
          <div style={{ color: '#7f8c8d' }}>
            {recentLogs.length > 0 ? (
              recentLogs.map((log, index) => (
                <div key={log.log_id} style={{ 
                  marginBottom: '10px', 
                  padding: '8px',
                  borderLeft: '3px solid #3498db',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {log.username} ({log.official_role})
                  </div>
                  <div style={{ fontSize: '12px' }}>{log.action}</div>
                  <div style={{ fontSize: '11px', color: '#95a5a6', marginTop: '2px' }}>
                    {formatDate(log.timestamp)} | {log.branch_name}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#bdc3c7',
                fontStyle: 'italic'
              }}>
                No recent activity found
              </div>
            )}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => handleQuickAction('registerStaff')}
              style={{
                padding: '12px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Register New Staff
            </button>
            <button 
              onClick={() => handleQuickAction('createDiscount')}
              style={{
                padding: '12px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#27ae60'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2ecc71'}
            >
              Manage Discounts
            </button>
            <button 
              onClick={() => handleQuickAction('manageTaxes')}
              style={{
                padding: '12px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d35400'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f39c12'}
            >
              Manage Taxes & Charges
            </button>
            <button 
              onClick={() => handleQuickAction('viewLogs')}
              style={{
                padding: '12px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
            >
              View System Logs
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', fontFamily: "Inter, 'Segoe UI', Arial, sans-serif" }}>
      <Sidebar />
      <div style={{ 
        marginLeft: '250px', 
        padding: '20px', 
        width: 'calc(100% - 250px)',
        minHeight: '100vh',
        backgroundColor: '#ecf0f1',
        fontFamily: "inherit",
        boxSizing: 'border-box',
        overflowX: 'auto'
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '15px',
          borderBottom: '2px solid #bdc3c7',
          fontFamily: "inherit"
        }}>
          <h1 style={{ color: '#2c3e50', margin: 0, fontFamily: "inherit" }}>Admin Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontFamily: "inherit" }}>
            <span style={{ color: '#7f8c8d', fontFamily: "inherit" }}>
              Welcome, {user?.username} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: "inherit"
              }}
            >
              Logout
            </button>
          </div>
        </header>
        <main style={{ fontFamily: "inherit" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
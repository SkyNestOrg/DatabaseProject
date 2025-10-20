import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Admin Dashboard' },
    { path: '/admin/manage-staff/create', label: 'Register Staff' },
    { path: '/admin/manage-staff', label: 'Manage Staff' },
    { path: '/admin/discounts', label: 'Discounts' },
    { path: '/admin/taxes', label: 'Taxes & Charges' },
    { path: '/admin/logs', label: 'System Logs' }
  ];

  return (
    <div style={{
      width: '200px',
      backgroundColor: '#2c3e50',
      color: 'white',
      height: '100vh',
      padding: '20px',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <h2 style={{ marginBottom: '30px', color: '#3498db' }}>SkyNest Hotels</h2>

      <nav>
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'block',
              padding: '12px 15px',
              color: location.pathname === item.path ? '#3498db' : '#bdc3c7',
              textDecoration: 'none',
              borderRadius: '5px',
              marginBottom: '5px',
              backgroundColor: location.pathname === item.path ? '#34495e' : 'transparent',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.backgroundColor = '#34495e';
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
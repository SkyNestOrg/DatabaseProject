// Admin/ManageStaff.jsx - Updated for main project
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from './components/Layout';

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/managestaff', {
        headers: { 'x-access-token': token }
      });
      setStaff(response.data);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (username) => {
    if (window.confirm(`Are you sure you want to delete staff member ${username}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/managestaff/${username}`, {
          headers: { 'x-access-token': token }
        });
        fetchStaff();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete staff member');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Loading staff...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
      }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>Manage Staff</h2>
        <button
          onClick={() => navigate('/admin/manage-staff/create')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Register Staff
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* ...existing code... */}
        {staff.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#7f8c8d' 
          }}>
            <h3>No Staff Members Found</h3>
            <p>No staff members are currently registered in the system.</p>
            <button
              onClick={() => navigate('/admin/manage-staff/create')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Register First Staff Member
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Branch</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member, index) => (
                <tr key={member.username} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <td style={{ padding: '15px' }}>{member.username}</td>
                  <td style={{ padding: '15px' }}>{member.official_role}</td>
                  <td style={{ padding: '15px' }}>{member.branch_name}</td>
                  <td style={{ padding: '15px' }}>
                    <button
                      onClick={() => navigate(`/admin/manage-staff/edit/${member.username}`, { state: { staff: member } })}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        marginRight: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStaff(member.username)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default ManageStaff;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';

const ManageStaffCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    official_role: '',
    branch_id: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const roles = [
    'Admin',
    'Front Desk Officer',
    'Service Officer',
    'Management'
  ];

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/managestaff/branches', {
        headers: { 'x-access-token': token }
      });
      setBranches(response.data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== confirmPassword) {
      alert('Passwords do not match! Please make sure both password fields are identical.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/managestaff', formData, {
        headers: { 'x-access-token': token }
      });
      navigate('/admin/manage-staff');
    } catch (error) {
      alert('Failed to register staff: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>Register New Staff</h2>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: `2px solid ${confirmPassword && formData.password !== confirmPassword ? '#e74c3c' : '#bdc3c7'}`, 
                borderRadius: '5px', 
                fontSize: '16px', 
                boxSizing: 'border-box' 
              }}
            />
            {confirmPassword && formData.password !== confirmPassword && (
              <small style={{ color: '#e74c3c', display: 'block', marginTop: '5px' }}>
                Passwords do not match
              </small>
            )}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>Role *</label>
            <select
              name="official_role"
              value={formData.official_role}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>Branch *</label>
            <select
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 30px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Registering...' : 'Register Staff'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/manage-staff')}
              style={{
                padding: '12px 30px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ManageStaffCreate;

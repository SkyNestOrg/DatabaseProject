import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';

const ManageStaffEdit = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const location = useLocation();
  const existingStaff = location.state?.staff;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    official_role: '',
    branch_id: ''
  });
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
    if (existingStaff) {
      setFormData({
        username: existingStaff.username,
        password: '', // Password left blank for security
        official_role: existingStaff.official_role,
        branch_id: existingStaff.branch_id
      });
    }
  }, [existingStaff]);

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
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const updateData = { ...formData };
      
      // Only include password if it's been changed
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await axios.put(`/managestaff/${username}`, updateData, {
        headers: { 'x-access-token': token }
      });
      navigate('/admin/manage-staff');
    } catch (error) {
      alert('Failed to update staff: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>Edit Staff Member</h2>
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
              disabled
              style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box', backgroundColor: '#ecf0f1', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#7f8c8d' }}>Username cannot be changed</small>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
            />
            <small style={{ color: '#7f8c8d' }}>Leave blank if you don't want to change the password</small>
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
              {loading ? 'Updating...' : 'Update Staff'}
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

export default ManageStaffEdit;

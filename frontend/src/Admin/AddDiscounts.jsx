import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';

const AddDiscounts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const editingDiscount = location.state?.discount;
  const isEdit = Boolean(id || editingDiscount);

  const [branches, setBranches] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    percentage: '',
    branch_id: '',
    room_type: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchBranches();
    fetchRoomTypes();
    
    if (editingDiscount) {
      setFormData({
        percentage: editingDiscount.percentage?.toString() || '',
        branch_id: editingDiscount.branch_id.toString(),
        room_type: editingDiscount.room_type,
        start_date: formatDateForInput(editingDiscount.start_date),
        end_date: formatDateForInput(editingDiscount.end_date)
      });
    }
  }, [editingDiscount]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

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

  const fetchRoomTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/viewdiscounts/room-types', {
        headers: { 'x-access-token': token }
      });
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Failed to fetch room types:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (isEdit && editingDiscount) {
        await axios.put(`/adddiscounts/${editingDiscount.discount_id}`, formData, {
          headers: { 'x-access-token': token }
        });
      } else {
        await axios.post('/adddiscounts', formData, {
          headers: { 'x-access-token': token }
        });
      }

      navigate('/admin/discounts');
    } catch (error) {
      alert('Operation failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>
        {isEdit ? 'Edit Discount' : 'Create New Discount'}
      </h2>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>
                Discount Percentage (%) *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={formData.percentage}
                onChange={(e) => setFormData({...formData, percentage: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>
                Branch *
              </label>
              <select
                value={formData.branch_id}
                onChange={(e) => setFormData({...formData, branch_id: e.target.value})}
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
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>
              Room Type *
            </label>
            <select
              value={formData.room_type}
              onChange={(e) => setFormData({...formData, room_type: e.target.value})}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
            >
              <option value="">Select Room Type</option>
              {roomTypes.map(roomType => (
                <option key={roomType.type_name} value={roomType.type_name}>
                  {roomType.type_name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>
                Start Date *
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>
                End Date *
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>
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
              {loading ? 'Saving...' : (isEdit ? 'Update Discount' : 'Create Discount')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/discounts')}
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

export default AddDiscounts;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';

const ViewDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/viewdiscounts', {
        headers: { 'x-access-token': token }
      });
      setDiscounts(response.data);
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscount = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/adddiscounts/${id}`, {
          headers: { 'x-access-token': token }
        });
        fetchDiscounts();
      } catch (error) {
        alert('Failed to delete discount');
      }
    }
  };

  const isDiscountActive = (discount) => {
    const today = new Date().toISOString().split('T')[0];
    return discount.start_date <= today && discount.end_date >= today;
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div>Loading discounts...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h2 style={{ color: '#2c3e50', margin: 0 }}>View Discounts</h2>
          <button
            onClick={() => navigate('/admin/add-discounts')}
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
            + Create Discount
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {discounts.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#7f8c8d' 
            }}>
              <h3>No Discounts Found</h3>
              <p>No discounts are currently configured in the system.</p>
              <button
                onClick={() => navigate('/admin/add-discounts')}
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
                Create First Discount
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Percentage</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Branch</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Room Type</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Start Date</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>End Date</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount, index) => (
                  <tr key={discount.discount_id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                    <td style={{ padding: '15px' }}>{discount.discount_id}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{discount.percentage}%</td>
                    <td style={{ padding: '15px' }}>{discount.branch_name}</td>
                    <td style={{ padding: '15px' }}>{discount.room_type_name || discount.room_type}</td>
                    <td style={{ padding: '15px' }}>{new Date(discount.start_date).toLocaleDateString()}</td>
                    <td style={{ padding: '15px' }}>{new Date(discount.end_date).toLocaleDateString()}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        backgroundColor: isDiscountActive(discount) ? '#d4edda' : '#f8d7da',
                        color: isDiscountActive(discount) ? '#155724' : '#721c24'
                      }}>
                        {isDiscountActive(discount) ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button
                        onClick={() => navigate(`/admin/add-discounts/${discount.discount_id}`, { state: { discount } })}
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
                        onClick={() => deleteDiscount(discount.discount_id)}
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
      </div>
    </Layout>
  );
};

export default ViewDiscounts;

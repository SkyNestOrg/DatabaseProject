import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';

const ViewTaxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/viewtaxes', {
        headers: { 'x-access-token': token }
      });
      setTaxes(response.data);
    } catch (error) {
      console.error('Failed to fetch taxes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTax = async (id) => {
    if (window.confirm('Are you sure you want to delete this tax revision?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/addtaxes/${id}`, {
          headers: { 'x-access-token': token }
        });
        fetchTaxes();
      } catch (error) {
        alert('Failed to delete tax revision');
      }
    }
  };

  const isCurrentTax = (tax) => {
    const latestTax = taxes[0]; // Assuming sorted by date DESC
    return latestTax && tax.revision_id === latestTax.revision_id;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Loading taxes...</div>
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
        <h2 style={{ color: '#2c3e50', margin: 0 }}>View Taxes & Charges</h2>
        <button
          onClick={() => navigate('/admin/add-taxes')}
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
          + Add Tax Revision
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* ...existing code... */}
        {taxes.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#7f8c8d' 
          }}>
            <h3>No Tax Revisions Found</h3>
            <p>No tax revisions are currently configured in the system.</p>
            <button
              onClick={() => navigate('/admin/add-taxes')}
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
              Create First Tax Revision
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Revision ID</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Revision Date</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Tax %</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Surcharge %</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map((tax, index) => (
                <tr key={tax.revision_id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <td style={{ padding: '15px' }}>{tax.revision_id}</td>
                  <td style={{ padding: '15px' }}>{new Date(tax.revision_date).toLocaleDateString()}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{tax.latest_tax_percentage}%</td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{tax.latest_surcharge_percentage}%</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: isCurrentTax(tax) ? '#d4edda' : '#fff3cd',
                      color: isCurrentTax(tax) ? '#155724' : '#856404'
                    }}>
                      {isCurrentTax(tax) ? 'Current' : 'Historical'}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button
                      onClick={() => navigate(`/admin/add-taxes/${tax.revision_id}`, { state: { tax } })}
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
                      onClick={() => deleteTax(tax.revision_id)}
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

export default ViewTaxes;

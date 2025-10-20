import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';

const AddTaxes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const editingTax = location.state?.tax;
  const isEdit = Boolean(id || editingTax);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    revision_date: '',
    latest_tax_percentage: '',
    latest_surcharge_percentage: ''
  });

  useEffect(() => {
    if (editingTax) {
      setFormData({
        revision_date: editingTax.revision_date,
        latest_tax_percentage: editingTax.latest_tax_percentage,
        latest_surcharge_percentage: editingTax.latest_surcharge_percentage
      });
    }
  }, [editingTax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (isEdit && editingTax) {
        await axios.put(`/addtaxes/${editingTax.revision_id}`, formData, {
          headers: { 'x-access-token': token }
        });
      } else {
        await axios.post('/addtaxes', formData, {
          headers: { 'x-access-token': token }
        });
      }

      navigate('/admin/taxes');
    } catch (error) {
      alert('Operation failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>
        {isEdit ? 'Edit Tax Revision' : 'Create New Tax Revision'}
      </h2>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit}>
          {/* ...existing form code... */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>
                Revision Date *
              </label>
              <input
                type="date"
                value={formData.revision_date}
                onChange={(e) => setFormData({...formData, revision_date: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>
                Tax Percentage (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.latest_tax_percentage}
                onChange={(e) => setFormData({...formData, latest_tax_percentage: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e' }}>
                Surcharge Percentage (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.latest_surcharge_percentage}
                onChange={(e) => setFormData({...formData, latest_surcharge_percentage: e.target.value})}
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
              {loading ? 'Saving...' : (isEdit ? 'Update Tax Revision' : 'Create Tax Revision')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/taxes')}
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

export default AddTaxes;

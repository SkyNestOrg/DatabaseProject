import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';

const ViewLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, search]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get('/viewlogs', {
        headers: { 'x-access-token': token },
        params: {
          page: pagination.page,
          limit: 50,
          search: search
        }
      });
      
      console.log('Logs response:', response.data);
      setLogs(response.data.logs);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setError('Failed to load system logs: ' + (error.response?.data?.error || error.message));
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Loading system logs...</div>
      </div>
    );
  }

  return (
    <Layout>
      <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>View System Logs</h2>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchLogs}
            style={{
              marginLeft: '15px',
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search logs by username, action, branch, or role..."
          value={search}
          onChange={handleSearch}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #bdc3c7',
            borderRadius: '5px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* ...existing code... */}
        {logs.length === 0 && !loading ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#7f8c8d' 
          }}>
            <h3>No System Logs Found</h3>
            <p>No activity has been logged yet. Logs will appear here as users perform actions in the system.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Timestamp</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Branch</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr 
                  key={log.log_id}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #ecf0f1'
                  }}
                >
                  <td style={{ padding: '15px', fontSize: '14px', color: '#7f8c8d' }}>
                    {formatDate(log.timestamp)}
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{log.username}</td>
                  <td style={{ padding: '15px' }}>{log.official_role}</td>
                  <td style={{ padding: '15px' }}>{log.branch_name}</td>
                  <td style={{ padding: '15px' }}>{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {logs.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: '#7f8c8d'
        }}>
          <div>
            Showing {logs.length} of {pagination.total} logs
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: pagination.page === 1 ? '#bdc3c7' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span style={{ padding: '8px 16px' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              style={{
                padding: '8px 16px',
                backgroundColor: pagination.page === pagination.totalPages ? '#bdc3c7' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ViewLogs;
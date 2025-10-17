import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/service/dashboard");
        console.log('Dashboard response:', res.data);
        setStats(res.data);
        setError("");
      } catch (err) {
        console.error('Dashboard API Error:', err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="dashboard-container">
      <div className="loading">Loading dashboard...</div>
    </div>
  );
  
  if (error) return (
    <div className="dashboard-container">
      <div className="error">Error: {error}</div>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h1>📊 Service Office Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stats-card pending">
          <div className="stats-icon">⏳</div>
          <div className="stats-content">
            <h3>Pending Services</h3>
            <p className="stats-value">{stats.pendingServices || 0}</p>
            <span className="stats-label">Services awaiting completion</span>
          </div>
        </div>
        
        <div className="stats-card completed">
          <div className="stats-icon">✅</div>
          <div className="stats-content">
            <h3>Completed Services</h3>
            <p className="stats-value">{stats.completedServices || 0}</p>
            <span className="stats-label">Services completed</span>
          </div>
        </div>
        
        <div className="stats-card total">
          <div className="stats-icon">📊</div>
          <div className="stats-content">
            <h3>Total Requests</h3>
            <p className="stats-value">{stats.totalRequests || 0}</p>
            <span className="stats-label">All service requests</span>
          </div>
        </div>

        <div className="stats-card cancelled">
          <div className="stats-icon">❌</div>
          <div className="stats-content">
            <h3>Cancelled Services</h3>
            <p className="stats-value">{stats.cancelledServices || 0}</p>
            <span className="stats-label">Cancelled requests</span>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={() => navigate('/due-services')}
          className="action-btn primary"
        >
          📋 View Due Services ({stats.pendingServices || 0})
        </button>
        
        <button 
          onClick={() => navigate('/service-history')}
          className="action-btn secondary"
        >
          📝 Service History
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          className="action-btn refresh"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
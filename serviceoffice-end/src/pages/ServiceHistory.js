import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import './ServiceHistory.css';

const ServiceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: '',
    requestType: '',
    dateFrom: '',
    dateTo: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get("/service/history", { params: filters });
        console.log('Service history response:', res.data);
        setHistory(res.data.history || res.data || []);
        setError("");
      } catch (err) {
        console.error('Service history error:', err);
        setError("Failed to load service history");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      requestType: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  if (loading) return (
    <div className="service-history-container">
      <div className="loading">Loading service history...</div>
    </div>
  );

  return (
    <div className="service-history-container">
      <div className="service-history-header">
        <h2>📝 Service History</h2>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Service Type:</label>
            <select
              value={filters.requestType}
              onChange={(e) => handleFilterChange('requestType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="room cleaning">Room Cleaning</option>
              <option value="maintenance">Maintenance</option>
              <option value="laundry">Laundry</option>
              <option value="room service">Room Service</option>
              <option value="concierge">Concierge</option>
            </select>
          </div>

          <div className="filter-group">
            <label>From Date:</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>To Date:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {history.length === 0 ? (
        <div className="no-history">
          <h3>📄 No service history found</h3>
          <p>No services match the current filters.</p>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Type</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Request Date</th>
                <th>Completion Date</th>
                <th>Status</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {history.map((service) => (
                <tr key={service.service_request_id}>
                  <td>{service.service_request_id}</td>
                  <td>{service.request_type}</td>
                  <td>{`${service.first_name || ''} ${service.last_name || ''}`.trim() || 'N/A'}</td>
                  <td>Room {service.room_number}</td>
                  <td>{new Date(service.date_time).toLocaleDateString()}</td>
                  <td>
                    {service.completion_date 
                      ? new Date(service.completion_date).toLocaleDateString()
                      : 'N/A'
                    }
                  </td>
                  <td>
                    <span className={`service-status ${service.status}`}>
                      {service.status}
                    </span>
                  </td>
                  <td>
                    <span className="cost-display">
                      {service.cost ? `$${service.cost}` : 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;

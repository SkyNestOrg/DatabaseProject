import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ServiceHistory.css";

const ServiceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20); // records per page
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    requestType: "",
    dateFrom: "",
    dateTo: "",
  });
  const navigate = useNavigate();

  // Fetch data when filters OR currentPage changes
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        // Query parameters
        const params = {
          limit,
          offset: (currentPage - 1) * limit,
        };

        // Add non-empty filters to params
        if (filters.status) params.status = filters.status;
        if (filters.requestType) params.requestType = filters.requestType;
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;

        console.log("Dates for filter:", {
          from: filters.dateFrom
        });
        console.log("Fetching with params:", params);
        const res = await api.get("/service/history", { params });
        console.log("Service history response:", res.data);

        setHistory(res.data.history || []);
        setTotalRecords(res.data.totalRecords || 0);
        setTotalPages(res.data.totalPages || 0);
        setError("");
      } catch (err) {
        console.error("Service history error:", err);
        setError("Failed to load service history");
        setHistory([]);
        setTotalRecords(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [filters, currentPage, limit]); // Include currentPage in dependencies

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters]); // Don't include currentPage to avoid infinite loop

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      requestType: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading)
    return (
      <div className="service-history-container">
        <div className="loading">Loading service history...</div>
      </div>
    );

  return (
    <div className="service-history-container">
      <div className="service-history-header">
        <h2>📝 Service History</h2>
        <button onClick={() => navigate("/dashboard")} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
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
              onChange={(e) =>
                handleFilterChange("requestType", e.target.value)
              }
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
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>To Date:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span>
          Showing {totalRecords > 0 ? (currentPage - 1) * limit + 1 : 0}-
          {Math.min(currentPage * limit, totalRecords)} of {totalRecords}{" "}
          results
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {error && (
        <div className="error">
          {error}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {history.length === 0 && !loading ? (
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
                  <td>
                    {`${service.first_name || ""} ${
                      service.last_name || ""
                    }`.trim() || "N/A"}
                  </td>
                  <td>Room {service.room_number}</td>
                  <td>{new Date(service.date_time).toLocaleDateString()}</td>
                  <td>
                    {service.completion_date
                      ? new Date(service.completion_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <span className={`service-status ${service.status}`}>
                      {service.status}
                    </span>
                  </td>
                  <td>
                    <span className="cost-display">
                      {service.cost
                        ? `$${parseFloat(service.cost).toFixed(2)}`
                        : "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            « Previous
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`pagination-btn ${
                currentPage === page ? "active" : ""
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;

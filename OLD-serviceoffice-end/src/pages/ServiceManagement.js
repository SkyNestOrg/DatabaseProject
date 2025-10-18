import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ServiceManagement.css";

const ServiceManagement = () => {
  const { user, token } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    service_type: "",
    unit_quantity_charges: "",
    availability: "Available",
  });

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log("Fetching services with token:", token);

      const response = await fetch("http://localhost:5000/service/services", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Fetch services response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetch services response data:", data);

      if (data.success) {
        setServices(data.services);
      } else {
        setError(data.message || "Failed to fetch services");
      }
    } catch (err) {
      setError("Network error occurrrrrrrrrrred");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    if (!formData.service_type || !formData.unit_quantity_charges) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/service/services", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setServices([...services, data.service]);
        setFormData({
          service_type: "",
          unit_quantity_charges: "",
          availability: "Available",
        });
        setShowAddForm(false);
        setError(null);
      } else {
        setError(data.message || "Failed to add service");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error adding service:", err);
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();

    if (!formData.unit_quantity_charges) {
      setError("Please enter unit quantity charges");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/service/services/${editingService.service_type}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            unit_quantity_charges: formData.unit_quantity_charges,
            availability: formData.availability,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setServices(
          services.map((service) =>
            service.service_type === editingService.service_type
              ? data.service
              : service
          )
        );
        setEditingService(null);
        setFormData({
          service_type: "",
          unit_quantity_charges: "",
          availability: "Available",
        });
        setError(null);
      } else {
        setError(data.message || "Failed to update service");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error updating service:", err);
    }
  };

  const handleDeleteService = async (serviceType) => {
    if (
      !window.confirm(
        `Are you sure you want to disable the service "${serviceType}"?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/service/services/${serviceType}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update the service availability to 'Unavailable' in the local state
        setServices(
          services.map((service) =>
            service.service_type === serviceType
              ? { ...service, availability: "Unavailable" }
              : service
          )
        );
      } else {
        setError(data.message || "Failed to disable service");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error disabling service:", err);
    }
  };

  const startEdit = (service) => {
    setEditingService(service);
    setFormData({
      service_type: service.service_type,
      unit_quantity_charges: service.unit_quantity_charges,
      availability: service.availability,
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingService(null);
    setFormData({
      service_type: "",
      unit_quantity_charges: "",
      availability: "Available",
    });
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      service_type: "",
      unit_quantity_charges: "",
      availability: "Available",
    });
    setError(null);
  };

  if (loading) {
    return (
      <div className="service-management">
        <div className="loading">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="service-management">
      <div className="service-management-header">
        <h2>Service Management</h2>
        <p>Branch: {user?.branch_id} | Manage services for your branch</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">
            ×
          </button>
        </div>
      )}

      <div className="service-actions">
        {!showAddForm && !editingService && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Service
          </button>
        )}
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="service-form">
          <h3>Add New Service</h3>
          <form onSubmit={handleAddService}>
            <div className="form-group">
              <label htmlFor="service_type">Service Type *</label>
              <input
                type="text"
                id="service_type"
                value={formData.service_type}
                onChange={(e) =>
                  setFormData({ ...formData, service_type: e.target.value })
                }
                placeholder="e.g., Room Service, Laundry, Spa"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="unit_quantity_charges">Unit Price *</label>
              <input
                type="number"
                id="unit_quantity_charges"
                value={formData.unit_quantity_charges}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit_quantity_charges: e.target.value,
                  })
                }
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                Add Service
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelAdd}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Service Form */}
      {editingService && (
        <div className="service-form">
          <h3>Edit Service: {editingService.service_type}</h3>
          <form onSubmit={handleUpdateService}>
            <div className="form-group">
              <label htmlFor="edit_unit_quantity_charges">Unit Price *</label>
              <input
                type="number"
                id="edit_unit_quantity_charges"
                value={formData.unit_quantity_charges}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit_quantity_charges: e.target.value,
                  })
                }
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit_availability">Availability</label>
              <select
                id="edit_availability"
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                Update Service
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="services-list">
        <h3>Current Services ({services.length})</h3>

        {services.length === 0 ? (
          <div className="no-services">
            <p>No services found for your branch.</p>
            {!showAddForm && (
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Add Your First Service
              </button>
            )}
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div
                key={service.service_type}
                className={`service-card ${service.availability.toLowerCase()}`}
              >
                <div className="service-header">
                  <h4>{service.service_type}</h4>
                  <span
                    className={`availability-badge ${service.availability.toLowerCase()}`}
                  >
                    {service.availability}
                  </span>
                </div>
                <div className="service-details">
                  <p className="price">
                    <strong>
                      ${parseFloat(service.unit_quantity_charges).toFixed(2)}
                    </strong>
                    <span> per unit</span>
                  </p>
                </div>
                <div className="service-actions">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => startEdit(service)}
                    disabled={editingService || showAddForm}
                  >
                    Edit
                  </button>
                  {service.availability === "Available" && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteService(service.service_type)}
                      disabled={editingService || showAddForm}
                    >
                      Disable
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="refresh-section">
        <button
          className="btn btn-secondary"
          onClick={fetchServices}
          disabled={loading}
        >
          🔄 Refresh Services
        </button>
      </div>
    </div>
  );
};

export default ServiceManagement;

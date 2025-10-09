import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./DueServices.css";

const DueServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/service/requests");
        console.log("Due services response:", res.data);
        
        // Safely handle response data with fallbacks
        const servicesData = res.data?.services || res.data || [];
        const safeServices = Array.isArray(servicesData) ? servicesData : [];
        
        setServices(safeServices);
        setError("");
      } catch (err) {
        console.error("Due services error:", err);
        setError("Failed to load due services");
        setServices([]); // Ensure services is always an array
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const markCompleted = async (id) => {
    // open confirmation modal for this service
    const svc = services.find((s) => s.service_request_id === id);
    if (!svc) return;
    setSelectedService(svc);
    setConfirmOpen(true);
  };

  const confirmComplete = async () => {
    if (!selectedService) return;
    setCompleting(true);
    setNotification(null);
    try {
      const response = await api.put(
        `/service/requests/${selectedService.service_request_id}`
      );
      console.log("Complete service response:", response.data);

      // remove completed service from list
      setServices((prev) =>
        prev.filter(
          (srv) => srv.service_request_id !== selectedService.service_request_id
        )
      );

      setNotification({
        type: "success",
        message: `Service completed — cost added: $${
          response.data.costadded || "N/A"
        }`,
      });
      setConfirmOpen(false);
      setSelectedService(null);
    } catch (err) {
      console.error("Complete service error:", err);
      const msg =
        err.response?.data?.message || "Failed to mark service as completed";
      setNotification({ type: "error", message: msg });
    } finally {
      setCompleting(false);
    }
  };

  // auto-dismiss notifications after 4 seconds
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(t);
  }, [notification]);

  const cancelConfirm = () => {
    setConfirmOpen(false);
    setSelectedService(null);
  };

  if (loading)
    return (
      <div className="due-services-container">
        <div className="loading">Loading due services...</div>
      </div>
    );

  if (error)
    return (
      <div className="due-services-container">
        <div className="error">Error: {error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );

  return (
    <div className="due-services-container">
      {/* notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button
            className="notify-close"
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}
      <div className="due-services-header">
        <h2>⏳ Due Services</h2>
        <button onClick={() => navigate("/dashboard")} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      {services.length === 0 ? (
        <div className="no-services">
          <h3>🎉 No pending services!</h3>
          <p>All services are up to date.</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => {
            // Safety checks for service data
            if (!service || typeof service !== 'object') {
              console.warn('Invalid service data:', service);
              return null;
            }
            
            const serviceId = service.service_request_id || `unknown-${Math.random()}`;
            const requestType = service.request_type || 'Unknown Service';
            const guestName = `${service.first_name || ""} ${service.last_name || ""}`.trim() || "N/A";
            const roomNumber = service.room_number || 'N/A';
            const serviceDate = service.date_time ? new Date(service.date_time) : null;
            const status = service.status || 'unknown';
            
            return (
              <div key={serviceId} className="service-card">
                <h3>🔧 {requestType}</h3>
                <div className="service-info">
                  <p>
                    <strong>ID:</strong> {serviceId}
                  </p>
                  <p>
                    <strong>Guest:</strong> {guestName}
                  </p>
                  <p>
                    <strong>Room:</strong> {roomNumber}
                  </p>
                  <p>
                    <strong>Date/Time:</strong>{" "}
                    {serviceDate && !isNaN(serviceDate.getTime()) 
                      ? serviceDate.toLocaleString() 
                      : 'Invalid Date'
                    }
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`service-status ${status}`}>
                      {status}
                    </span>
                  </p>
                </div>
                <div className="service-actions">
                  <button
                    className="complete-button"
                    onClick={() => markCompleted(serviceId)}
                  >
                    ✅ Mark Complete
                  </button>
                </div>
              </div>
            );
          }).filter(Boolean)} {/* Filter out null entries */}
        </div>
      )}

      {/* confirmation modal */}
      {confirmOpen && selectedService && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Confirm completion</h3>
            <p>
              Mark service "{selectedService.request_type}" (ID:{" "}
              {selectedService.service_request_id}) as completed? This will add
              the service charge to the guest's account.
            </p>
            <div className="confirm-actions">
              <button
                className="btn cancel"
                onClick={cancelConfirm}
                disabled={completing}
              >
                Cancel
              </button>
              <button
                className="btn confirm"
                onClick={confirmComplete}
                disabled={completing}
              >
                {completing ? "Completing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueServices;

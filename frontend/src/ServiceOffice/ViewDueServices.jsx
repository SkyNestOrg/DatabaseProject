import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewDueServices() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get('http://localhost:5000/serviceoffice/requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setRequests(response.data.requests || []);
            setError('');
        } catch (error) {
            console.error('Error fetching requests:', error);
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => {
                    navigate('/serviceofficelogin');
                }, 2000);
            } else {
                setError(error.response?.data?.message || 'Failed to load requests');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const confirmMarkComplete = async () => {
        if (!selectedRequest) return;

        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.put(
                `http://localhost:5000/serviceoffice/requests/${selectedRequest.service_request_id}`,
                { status: 'Completed' },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Remove the completed request from the list immediately
            setRequests(prevRequests => 
                prevRequests.filter(req => req.service_request_id !== selectedRequest.service_request_id)
            );
            
            showToast('Service marked as completed successfully!', 'success');
        } catch (error) {
            console.error('Error completing service:', error);
            showToast(error.response?.data?.message || 'Failed to complete service', 'error');
        } finally {
            setShowModal(false);
            setSelectedRequest(null);
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Loading due services...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Toast Notification */}
            {toast.show && (
                <div style={{
                    ...styles.toast,
                    backgroundColor: toast.type === 'success' ? '#27ae60' : '#e74c3c'
                }}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Pending Service Requests</h1>
                <button onClick={fetchRequests} style={styles.refreshBtn}>
                    🔄 Refresh
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            {/* Stats */}
            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <h3>Total Pending</h3>
                    <p style={styles.statNumber}>{requests.length}</p>
                </div>
            </div>

            {/* Requests Grid */}
            {requests.length === 0 ? (
                <div style={styles.noRequests}>
                    <h3>No pending requests</h3>
                    <p>All service requests are completed for your branch.</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {requests.map((request) => (
                        <div key={request.service_request_id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.requestId}>#{request.service_request_id}</span>
                                <span style={styles.statusBadge}>{request.status}</span>
                            </div>
                            
                            <div style={styles.cardBody}>
                                <div style={styles.infoRow}>
                                    <strong>Service Type:</strong>
                                    <span>{request.request_type}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <strong>Room:</strong>
                                    <span>{request.room_number}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <strong>Booking ID:</strong>
                                    <span>#{request.booking_id}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <strong>Quantity:</strong>
                                    <span>{request.quantity}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <strong>Requested:</strong>
                                    <span style={styles.datetime}>{formatDateTime(request.date_time)}</span>
                                </div>
                            </div>

                            <div style={styles.cardFooter}>
                                <button
                                    onClick={() => handleMarkComplete(request)}
                                    style={styles.completeBtn}
                                >
                                    ✓ Mark Complete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>Confirm Completion</h2>
                        <p style={styles.modalText}>
                            Are you sure you want to mark this service as completed?
                        </p>
                        {selectedRequest && (
                            <div style={styles.modalDetails}>
                                <p><strong>Service:</strong> {selectedRequest.request_type}</p>
                                <p><strong>Room:</strong> {selectedRequest.room_number}</p>
                                <p><strong>Request ID:</strong> #{selectedRequest.service_request_id}</p>
                            </div>
                        )}
                        <div style={styles.modalButtons}>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedRequest(null);
                                }}
                                style={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmMarkComplete}
                                style={styles.confirmBtn}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'Segoe UI, sans-serif',
        backgroundColor: '#f5f7fa',
        minHeight: '100vh'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontSize: '1.2rem',
        color: '#7f8c8d'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    title: {
        fontSize: '2rem',
        color: '#2c3e50',
        margin: 0
    },
    refreshBtn: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '0.7rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    },
    errorMessage: {
        backgroundColor: '#fadbd8',
        color: '#c0392b',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: '1px solid #e74c3c'
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        borderLeft: '4px solid #3498db'
    },
    statNumber: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#3498db',
        margin: '0.5rem 0 0 0'
    },
    noRequests: {
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#7f8c8d',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    cardHeader: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    requestId: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.1rem'
    },
    statusBadge: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        color: 'white',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: 'bold'
    },
    cardBody: {
        padding: '1.5rem'
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid #ecf0f1',
        fontSize: '0.95rem'
    },
    datetime: {
        color: '#7f8c8d',
        fontSize: '0.9rem'
    },
    cardFooter: {
        padding: '1rem 1.5rem',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #ecf0f1'
    },
    completeBtn: {
        width: '100%',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '0.8rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
    },
    modalTitle: {
        margin: '0 0 1rem 0',
        color: '#2c3e50',
        fontSize: '1.5rem'
    },
    modalText: {
        color: '#7f8c8d',
        marginBottom: '1.5rem'
    },
    modalDetails: {
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
    },
    modalButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end'
    },
    cancelBtn: {
        backgroundColor: '#95a5a6',
        color: 'white',
        border: 'none',
        padding: '0.7rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    confirmBtn: {
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '0.7rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    toast: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 1001,
        fontSize: '1rem',
        fontWeight: 'bold'
    }
};

export default ViewDueServices;
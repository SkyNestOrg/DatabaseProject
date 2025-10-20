import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewServiceHistory() {
    const [history, setHistory] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchServiceTypes();
        fetchHistory();
    }, []);

    const fetchServiceTypes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/serviceoffice/service-types', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setServiceTypes(response.data.serviceTypes || []);
        } catch (error) {
            console.error('Error fetching service types:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get('http://localhost:5000/serviceoffice/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setHistory(response.data.history || []);
            setError('');
        } catch (error) {
            console.error('Error fetching history:', error);
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => {
                    navigate('/serviceofficelogin');
                }, 2000);
            } else {
                setError(error.response?.data?.message || 'Failed to load service history');
            }
        } finally {
            setLoading(false);
        }
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

    // Filter history based on selected filters
    const getFilteredHistory = () => {
        return history.filter(item => {
            // Status filter
            if (statusFilter !== 'all' && item.status !== statusFilter) {
                return false;
            }
            
            // Service type filter
            if (serviceTypeFilter !== 'all' && item.request_type !== serviceTypeFilter) {
                return false;
            }
            
            // Date range filter
            const itemDate = new Date(item.date_time);
            if (startDate && new Date(startDate) > itemDate) {
                return false;
            }
            if (endDate && new Date(endDate) < itemDate) {
                return false;
            }
            
            return true;
        });
    };

    const filteredHistory = getFilteredHistory();
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearFilters = () => {
        setStatusFilter('all');
        setServiceTypeFilter('all');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Loading service history...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Service History</h1>
                <button onClick={fetchHistory} style={styles.refreshBtn}>
                    🔄 Refresh
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            {/* Filters Section */}
            <div style={styles.filtersSection}>
                <div style={styles.filterRow}>
                    <div style={styles.filterGroup}>
                        <label style={styles.label}>Status:</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={styles.select}
                        >
                            <option value="all">All</option>
                            <option value="Request Placed">Request Placed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.label}>Service Type:</label>
                        <select 
                            value={serviceTypeFilter} 
                            onChange={(e) => {
                                setServiceTypeFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={styles.select}
                        >
                            <option value="all">All</option>
                            {serviceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.label}>Start Date:</label>
                        <input 
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={styles.dateInput}
                        />
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.label}>End Date:</label>
                        <input 
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={styles.dateInput}
                        />
                    </div>

                    <button onClick={handleClearFilters} style={styles.clearBtn}>
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <h3>Total Records</h3>
                    <p style={styles.statNumber}>{history.length}</p>
                </div>
                <div style={styles.statCard}>
                    <h3>Filtered Records</h3>
                    <p style={styles.statNumber}>{filteredHistory.length}</p>
                </div>
            </div>

            {/* Table */}
            {paginatedHistory.length === 0 ? (
                <div style={styles.noData}>
                    <h3>No records found</h3>
                    <p>Try adjusting your filters or check back later.</p>
                </div>
            ) : (
                <>
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Request ID</th>
                                    <th style={styles.th}>Service Type</th>
                                    <th style={styles.th}>Room</th>
                                    <th style={styles.th}>Booking ID</th>
                                    <th style={styles.th}>Quantity</th>
                                    <th style={styles.th}>Request Date & Time</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedHistory.map((item) => (
                                    <tr key={item.service_request_id} style={styles.tr}>
                                        <td style={styles.td}>{item.service_request_id}</td>
                                        <td style={styles.td}>{item.request_type}</td>
                                        <td style={styles.td}>{item.room_number}</td>
                                        <td style={styles.td}>{item.booking_id}</td>
                                        <td style={{...styles.td, textAlign: 'center'}}>{item.quantity}</td>
                                        <td style={styles.td}>{formatDateTime(item.date_time)}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                ...(item.status === 'Completed' ? styles.statusCompleted : 
                                                    item.status === 'Cancelled' ? styles.statusCancelled : 
                                                    styles.statusPending)
                                            }}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={styles.pagination}>
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{
                                    ...styles.pageBtn,
                                    ...(currentPage === 1 ? styles.pageBtnDisabled : {})
                                }}
                            >
                                Previous
                            </button>
                            
                            <div style={styles.pageNumbers}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        style={{
                                            ...styles.pageNumber,
                                            ...(page === currentPage ? styles.pageNumberActive : {})
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{
                                    ...styles.pageBtn,
                                    ...(currentPage === totalPages ? styles.pageBtnDisabled : {})
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
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
    filtersSection: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    filterRow: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'flex-end'
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        flex: '1 1 200px'
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: '#2c3e50'
    },
    select: {
        padding: '0.6rem',
        borderRadius: '6px',
        border: '1px solid #bdc3c7',
        fontSize: '1rem',
        backgroundColor: 'white'
    },
    dateInput: {
        padding: '0.6rem',
        borderRadius: '6px',
        border: '1px solid #bdc3c7',
        fontSize: '1rem'
    },
    clearBtn: {
        backgroundColor: '#95a5a6',
        color: 'white',
        border: 'none',
        padding: '0.6rem 1.2rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        height: 'fit-content'
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
        borderLeft: '4px solid #9b59b6'
    },
    statNumber: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#9b59b6',
        margin: '0.5rem 0 0 0'
    },
    noData: {
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#7f8c8d',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    tableContainer: {
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        backgroundColor: '#34495e',
        color: 'white',
        padding: '1rem',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '0.9rem'
    },
    td: {
        padding: '1rem',
        borderBottom: '1px solid #ecf0f1',
        fontSize: '0.95rem'
    },
    tr: {
        transition: 'background-color 0.2s'
    },
    statusBadge: {
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        display: 'inline-block'
    },
    statusCompleted: {
        backgroundColor: '#d4edda',
        color: '#155724'
    },
    statusPending: {
        backgroundColor: '#fff3cd',
        color: '#856404'
    },
    statusCancelled: {
        backgroundColor: '#f8d7da',
        color: '#721c24'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem'
    },
    pageBtn: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '0.6rem 1.2rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    pageBtnDisabled: {
        backgroundColor: '#bdc3c7',
        cursor: 'not-allowed',
        opacity: 0.6
    },
    pageNumbers: {
        display: 'flex',
        gap: '0.5rem'
    },
    pageNumber: {
        backgroundColor: 'white',
        color: '#3498db',
        border: '1px solid #3498db',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    pageNumberActive: {
        backgroundColor: '#3498db',
        color: 'white'
    }
};

export default ViewServiceHistory;

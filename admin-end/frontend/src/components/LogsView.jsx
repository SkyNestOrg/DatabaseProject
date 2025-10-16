import React, { useEffect, useState } from 'react';
import { fetchLogs } from '../services/api';

export default function LogsView() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        username: '',
        page: 1,
        limit: 50
    });
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        loadLogs();
    }, [filters.page]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const res = await fetchLogs(filters);
            setLogs(res.data.logs);
            setPagination({
                total: res.data.total,
                page: res.data.page,
                totalPages: res.data.totalPages
            });
        } catch (err) {
            console.error('Error loading logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleSearch = () => {
        loadLogs();
    };

    return (
        <div>
            <div className="card-header">
                <h3>System Logs</h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <input
                        placeholder="Filter by username..."
                        value={filters.username}
                        onChange={(e) => handleFilterChange('username', e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                    <button onClick={handleSearch} className="btn btn-primary">
                        Search
                    </button>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <p>Loading logs...</p>
                ) : logs.length === 0 ? (
                    <p>No logs found.</p>
                ) : (
                    <>
                        <div className="table-container" style={{ maxHeight: '600px', overflow: 'auto' }}>
                            <table className="staff-table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>Branch</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.log_id}>
                                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                                            <td>{log.username}</td>
                                            <td>{log.official_role}</td>
                                            <td>{log.branch_name}</td>
                                            <td>{log.action}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginTop: '16px',
                            padding: '16px',
                            borderTop: '1px solid #eee'
                        }}>
                            <span>
                                Showing {(filters.page - 1) * filters.limit + 1} to {Math.min(filters.page * filters.limit, pagination.total)} of {pagination.total} entries
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    disabled={filters.page <= 1}
                                    onClick={() => handleFilterChange('page', filters.page - 1)}
                                    className="btn btn-secondary"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={filters.page >= pagination.totalPages}
                                    onClick={() => handleFilterChange('page', filters.page + 1)}
                                    className="btn btn-secondary"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
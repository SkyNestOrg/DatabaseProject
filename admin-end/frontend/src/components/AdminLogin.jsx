import React, { useState } from 'react';
import { adminLogin } from '../services/api';

export default function AdminLogin({ onLogin }) {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.username || !form.password) {
            setError('Please enter both username and password');
            return;
        }

        setLoading(true);
        try {
            const response = await adminLogin(form);
            if (response.data.success) {
                onLogin(response.data.user);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="card" style={{ maxWidth: '400px', margin: '100px auto' }}>
                <div className="card-header">
                    <h3>Admin Login</h3>
                    <p>SkyNest Hotels Management System</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter admin username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message" style={{ 
                            background: '#fed7d7', 
                            color: '#c53030', 
                            padding: '12px', 
                            borderRadius: '6px',
                            marginBottom: '16px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Logging in...' : 'Login as Admin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
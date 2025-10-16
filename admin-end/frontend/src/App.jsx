import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import StaffRegistrationForm from './components/StaffRegistrationForm';
import StaffManagement from './components/StaffManagement';
import LogsView from './components/LogsView';
import TaxesCharges from './components/TaxesCharges';
import DiscountManagement from './components/DiscountManagement';
import './styles.css';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('staff-registration');
    const [serverStatus, setServerStatus] = useState('checking');

    useEffect(() => {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                setCurrentUser(JSON.parse(savedUser));
            } catch (error) {
                localStorage.removeItem('currentUser');
            }
        }

        // Check server status
        checkServerStatus();
    }, []);

    const checkServerStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/health');
            if (response.ok) {
                setServerStatus('online');
            } else {
                setServerStatus('offline');
            }
        } catch (error) {
            setServerStatus('offline');
        }
    };

    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActiveTab('staff-registration');
        localStorage.removeItem('currentUser');
    };

    if (!currentUser) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return (
        <div className="container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">
                    <h1>SkyNest Hotels</h1>
                    <span>Admin Panel</span>
                    <div style={{ 
                        fontSize: '10px', 
                        marginTop: '5px',
                        color: serverStatus === 'online' ? '#90EE90' : '#FFB6C1'
                    }}>
                        ● {serverStatus === 'online' ? 'Server Online' : 'Server Offline'}
                    </div>
                </div>

                <div className="menu">
                    <div 
                        className={`menu-item ${activeTab === 'staff-registration' ? 'active' : ''}`}
                        onClick={() => setActiveTab('staff-registration')}
                    >
                        <i className="fas fa-user-plus"></i>
                        <span>Register Staff</span>
                    </div>
                    <div 
                        className={`menu-item ${activeTab === 'staff-management' ? 'active' : ''}`}
                        onClick={() => setActiveTab('staff-management')}
                    >
                        <i className="fas fa-users-cog"></i>
                        <span>Manage Staff</span>
                    </div>
                    <div 
                        className={`menu-item ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        <i className="fas fa-clipboard-list"></i>
                        <span>System Logs</span>
                    </div>
                    <div 
                        className={`menu-item ${activeTab === 'taxes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('taxes')}
                    >
                        <i className="fas fa-percentage"></i>
                        <span>Taxes & Charges</span>
                    </div>
                    <div 
                        className={`menu-item ${activeTab === 'discounts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('discounts')}
                    >
                        <i className="fas fa-tag"></i>
                        <span>Discounts</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h2>Admin Dashboard</h2>
                    <div className="user-info">
                        <span>Welcome, {currentUser.username} ({currentUser.official_role})</span>
                        <button 
                            onClick={handleLogout}
                            className="btn btn-secondary"
                            style={{ marginLeft: '16px' }}
                        >
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>

                {/* Server status warning */}
                {serverStatus === 'offline' && (
                    <div style={{
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        color: '#856404',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '20px'
                    }}>
                        <i className="fas fa-exclamation-triangle"></i> Backend server is offline. Please ensure the backend is running on port 5000.
                    </div>
                )}

                {/* Content based on active tab */}
                {activeTab === 'staff-registration' && <StaffRegistrationForm />}
                {activeTab === 'staff-management' && <StaffManagement />}
                {activeTab === 'logs' && <LogsView />}
                {activeTab === 'taxes' && <TaxesCharges />}
                {activeTab === 'discounts' && <DiscountManagement />}
            </div>
        </div>
    );
}

export default App;
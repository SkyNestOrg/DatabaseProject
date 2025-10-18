import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  // Mode: 'staff' or 'guest'
  const [mode, setMode] = useState('staff');

  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // State for UI feedback
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear global message when user starts typing
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Determine user role from returned user object
  const getUserRole = (user) => {
    if (!user) return 'management';
    // include official_role and other possible fields, normalize
    const roleVal = (user.role || user.user_role || user.role_name || user.official_role || '').toString().toLowerCase();

    if (!roleVal) return 'management';
    if (roleVal.includes('admin')) return 'admin';
    if (roleVal.includes('management') || roleVal.includes('manager') || roleVal.includes('manage')) return 'management';
    if (roleVal.includes('front')) return 'frontdesk';
    if (roleVal.includes('service')) return 'serviceoffice';

    // fallback
    return 'management';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    const endpoint = mode === 'staff' ? 'http://localhost:5000/stafflogin' : 'http://localhost:5000/guestlogin';

    try {
      const response = await axios.post(endpoint, {
        username: formData.username,
        password: formData.password
      });


      console.log('Login response:', response.data);

      if (response.data.success) {
        setMessage(response.data.status || 'Login successful!');
        setMessageType('success');
        
        // Store authentication token
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        // Store user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        // Redirect after brief delay so user sees success message
        setTimeout(() => {
          if (mode === 'guest') {
            // Guest response includes user.id (guest_id)
            const guest = response.data.user || {};
            if (guest.id) {
              window.location.href = `/guest?guest_id=${guest.id}`;
            } else {
              window.location.href = '/guest';
            }
            return;
          }

          // Staff flow: use existing role mapping and redirects
          const user = response.data.user || {};
          const role = (user.role || user.official_role || getUserRole(user) || '').toString().toLowerCase();

          // Debug logging (stringify to avoid collapsed live object issues)
          try { console.log('User object (raw):', JSON.stringify(user)); } catch (e) { console.log('User object (raw):', user); }
          console.log('Detected role:', role);

          switch(role) {
            case 'admin':
              window.location.href = `/admin`;
              break;
            case 'management':
              window.location.href = `/management`;
              break;
            case 'serviceoffice':
              window.location.href = `/service`;
              break;
            case 'frontdesk':
              window.location.href = `/frontdesk`;
              break;
            default:
              window.location.href = `/`;
          }
        }, 800);
      } else {
        setMessage(response.data.status || 'Login failed');
        setMessageType('error');
      }
    } catch (error) {

      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const serverMessage = error.response.data?.status || 
                             error.response.data?.message || 
                             'Login failed';
        setMessage(serverMessage);
        setMessageType('error');
        
        // Handle specific error codes
        if (error.response.status === 401) {
          setErrors({ 
            username: 'Invalid credentials', 
            password: 'Invalid credentials' 
          });
        }
      } else if (error.request) {
        // Network error
        setMessage('Network error. Please check your connection and try again.');
        setMessageType('error');
      } else {
        // Other error
        setMessage('An unexpected error occurred. Please try again.');
        setMessageType('error');
  } }finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        {/* Toggle bar */}
        <div className="toggle-bar">
          <button
            className={`toggle-btn ${mode === 'staff' ? 'active' : ''}`}
            onClick={() => setMode('staff')}
            disabled={mode === 'staff'}
          >Staff</button>
          <button
            className={`toggle-btn ${mode === 'guest' ? 'active' : ''}`}
            onClick={() => setMode('guest')}
            disabled={mode === 'guest'}
          >Guest</button>
        </div>

        <h2>{mode === 'staff' ? 'Staff Login' : 'Guest Login'}</h2>
        
        {/* Global message display */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter your username"
              disabled={loading}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {mode === 'guest' && (
              <button
                type="button"
                className="login-btn secondary"
                onClick={() => { window.location.href = '/guest/register'; }}
                disabled={loading}
              >
                Register
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Inline CSS for styling */}
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-form-wrapper {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 420px;
        }

        .toggle-bar {
          display:flex;
          gap:8px;
          justify-content:center;
          margin-bottom:12px;
        }

        .toggle-btn {
          padding:8px 14px;
          border-radius:8px;
          border:1px solid #e1e5e9;
          background:#f7f9fb;
          cursor:pointer;
          font-weight:600;
        }

        .toggle-btn.active {
          background: linear-gradient(135deg,#667eea,#764ba2);
          color:white;
          border-color:transparent;
        }

        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 18px;
          font-size: 22px;
          font-weight: 600;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 8px;
          color: #555;
          font-weight: 500;
          font-size: 14px;
        }

        input {
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          outline: none;
        }

        input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        input.error {
          border-color: #e74c3c;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }

        input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .error-text {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 6px;
          font-weight: 500;
        }

        .login-btn {
          padding: 12px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .login-btn.secondary {
          background: #eee;
          color: #333;
        }

        .login-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          text-align: center;
          font-weight: 500;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        /* Responsive design */
        @media (max-width: 480px) {
          .login-form-wrapper {
            padding: 30px 20px;
          }
          
          h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
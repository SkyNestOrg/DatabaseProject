import React, { useEffect, useState } from 'react';
import { fetchBranches, createStaff } from '../services/api';

export default function StaffRegistrationForm() {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirm_password: '',
    official_role: '',
    branch_id: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [recent, setRecent] = useState([]);

  const roles = ['Manager', 'Receptionist', 'Housekeeping', 'Concierge', 'Admin'];

  useEffect(() => {
    fetchBranches()
      .then(res => setBranches(res.data || []))
      .catch(() => setBranches([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      username: '',
      password: '',
      confirm_password: '',
      official_role: '',
      branch_id: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.username || !form.password || !form.official_role || !form.branch_id) {
      alert('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirm_password) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: form.username,
        password: form.password,
        official_role: form.official_role,
        branch_id: Number(form.branch_id)
      };
      const res = await createStaff(payload);
      // show success
      setSuccessVisible(true);
      // add to recent list
      setRecent(r => [{ username: res.data.username, official_role: res.data.official_role, branch_id: res.data.branch_id }, ...r]);
      resetForm();
      setTimeout(() => setSuccessVisible(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3>Register New Staff Member</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username <span className="required">*</span></label>
              <input id="username" name="username" value={form.username} onChange={handleChange} maxLength={20} required />
            </div>

            <div className="form-group">
              <label htmlFor="official_role">Official Role <span className="required">*</span></label>
              <select id="official_role" name="official_role" value={form.official_role} onChange={handleChange} required>
                <option value="">Select Role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group password-toggle">
              <label htmlFor="password">Password <span className="required">*</span></label>
              <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required />
              <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowPassword(s => !s)} aria-hidden="true" />
            </div>

            <div className="form-group password-toggle">
              <label htmlFor="confirm_password">Confirm Password <span className="required">*</span></label>
              <input id="confirm_password" type={showConfirm ? 'text' : 'password'} name="confirm_password" value={form.confirm_password} onChange={handleChange} required />
              <i className={`far ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowConfirm(s => !s)} aria-hidden="true" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="branch_id">Branch <span className="required">*</span></label>
              <select id="branch_id" name="branch_id" value={form.branch_id} onChange={handleChange} required>
                <option value="">Select Branch</option>
                {branches.map(b => (
                  <option key={b.branch_id} value={b.branch_id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register Staff Member'}
            </button>
          </div>
        </form>

        {successVisible && (
          <div className="success-message" role="status">
            <i className="fas fa-check-circle" style={{marginRight:8}}></i>
            Staff member has been successfully registered!
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recently Registered Staff</h3>
        </div>

        {recent.length === 0 ? (
          <p>No staff registered in this session yet.</p>
        ) : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Branch ID</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.username}</td>
                  <td>{r.official_role}</td>
                  <td>{r.branch_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

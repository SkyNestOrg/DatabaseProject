import React, { useEffect, useState } from "react";
import { fetchStaff, updateStaff, deleteStaff, fetchBranches } from "../services/api";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // new states for editing
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    official_role: "",
    branch_id: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  const roles = ['management-user', 'frontoffice-user', 'housekeeping-user', 'concierge-user', 'admin-user'];

  useEffect(() => {
    loadStaff();
    loadBranches();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await fetchStaff();
      setStaff(res.data || []);
    } catch (err) {
      console.error("Error loading staff:", err);
      alert("Failed to load staff: " + (err.response?.data?.error || err.message));
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const res = await fetchBranches();
      setBranches(res.data || []);
    } catch (err) {
      console.error("Error loading branches:", err);
      setBranches([]);
    }
  };

  const filtered = staff.filter(
    (s) =>
      s.username.toLowerCase().includes(filter.toLowerCase()) ||
      (s.official_role || "").toLowerCase().includes(filter.toLowerCase()) ||
      (s.branch_name || "").toLowerCase().includes(filter.toLowerCase())
  );

  // handle edit mode
  const handleEdit = (s) => {
    setEditingId(s.username);
    setFormData({
      username: s.username,
      official_role: s.official_role,
      branch_id: s.branch_id.toString(), // Ensure it's string for select value
    });
  };

  const handleUpdate = async () => {
    // condition to not edit if official_role is admin
    if (formData.official_role === 'admin-user') {
      alert("Cannot assign admin-user role");
      return;
    }
    
    if (!formData.official_role || !formData.branch_id) {
      alert("Please fill in all fields");
      return;
    }

    setActionLoading(true);
    try {
      const updateData = {
        official_role: formData.official_role,
        branch_id: parseInt(formData.branch_id) // Convert to number for backend
      };
      
      await updateStaff(editingId, updateData);
      setEditingId(null);
      setFormData({ username: "", official_role: "", branch_id: "" });
      await loadStaff(); // Reload to get updated data
      alert("Staff member updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.error || 'Failed to update staff member');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ username: "", official_role: "", branch_id: "" });
  };

  const handleDelete = async (username) => {
    if (!window.confirm(`Are you sure you want to delete staff member "${username}"? This action cannot be undone.`)) return;
    
    setActionLoading(true);
    try {
      await deleteStaff(username);
      await loadStaff(); // Reload to reflect deletion
      alert("Staff member deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.error || 'Failed to delete staff member');
    } finally {
      setActionLoading(false);
    }
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.branch_id === branchId);
    return branch ? branch.branch_name : `Branch ${branchId}`;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3>Staff Management</h3>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <input
            placeholder="Search username, role or branch..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", width: "300px" }}
          />
          <span style={{ color: "#666", fontSize: "14px" }}>
            {filtered.length} of {staff.length} staff members
          </span>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading staff data...</p>
        ) : filtered.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
          <div className="table-container">
            <table className="staff-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Branch ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{s.username}</strong>
                      {s.official_role === 'Admin' && (
                        <span style={{ 
                          marginLeft: "8px", 
                          background: "#2a5a9a", 
                          color: "white", 
                          padding: "2px 6px", 
                          borderRadius: "4px", 
                          fontSize: "12px" 
                        }}>
                          Admin
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === s.username ? (
                        <select
                          value={formData.official_role}
                          onChange={(e) =>
                            setFormData({ ...formData, official_role: e.target.value })
                          }
                          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                          disabled={actionLoading}
                        >
                          <option value="">Select Role</option>
                          {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "4px",
                          background: s.official_role === 'Admin' ? '#e3f2fd' : '#f3e5f5',
                          color: s.official_role === 'Admin' ? '#1565c0' : '#7b1fa2'
                        }}>
                          {s.official_role}
                        </span>
                      )}
                    </td>
                    <td>{s.branch_name || getBranchName(s.branch_id)}</td>
                    <td>
                      {editingId === s.username ? (
                        <select
                          value={formData.branch_id}
                          onChange={(e) =>
                            setFormData({ ...formData, branch_id: e.target.value })
                          }
                          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                          disabled={actionLoading}
                        >
                          <option value="">Select Branch</option>
                          {branches.map(branch => (
                            <option key={branch.branch_id} value={branch.branch_id}>
                              {branch.branch_name} ({branch.city})
                            </option>
                          ))}
                        </select>
                      ) : (
                        s.branch_id
                      )}
                    </td>
                    <td>
                      {editingId === s.username ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button 
                            className="btn btn-primary" 
                            onClick={handleUpdate}
                            disabled={actionLoading}
                            style={{ padding: "6px 12px", fontSize: "14px" }}
                          >
                            {actionLoading ? "Saving..." : "Save"}
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            onClick={cancelEdit}
                            disabled={actionLoading}
                            style={{ padding: "6px 12px", fontSize: "14px" }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button 
                            className="btn btn-primary" 
                            onClick={() => handleEdit(s)}
                            disabled={actionLoading}
                            style={{ padding: "6px 12px", fontSize: "14px" }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ 
                              marginLeft: "8px", 
                              color: "white", 
                              background: "#e53e3e",
                              padding: "6px 12px", 
                              fontSize: "14px" 
                            }}
                            onClick={() => handleDelete(s.username)}
                            disabled={actionLoading || s.official_role === 'Admin'}
                            title={s.official_role === 'Admin' ? 'Cannot delete admin users' : 'Delete staff member'}
                          >
                            {actionLoading ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Loading overlay for actions */}
        {actionLoading && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "10px" }}>Processing...</div>
              <div className="spinner"></div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2a5a9a;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
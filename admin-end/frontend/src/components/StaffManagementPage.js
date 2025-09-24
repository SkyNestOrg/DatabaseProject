import React, { useEffect, useState } from "react";
import { fetchStaff } from "../services/api";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await fetchStaff();
      setStaff(res.data || []);
    } catch (err) {
      console.error("Error loading staff:", err);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = staff.filter(s =>
    s.username.toLowerCase().includes(filter.toLowerCase()) ||
    (s.official_role || "").toLowerCase().includes(filter.toLowerCase()) ||
    (s.branch_name || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h3>All Staff</h3>
        <div>
          <input
            placeholder="Search username, role or branch..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {filtered.length === 0 ? (
              <p>No staff found.</p>
            ) : (
              <table className="staff-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Branch</th>
                    <th>Branch ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.username}</td>
                      <td>{s.official_role}</td>
                      <td>{s.branch_name ?? "-"}</td>
                      <td>{s.branch_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';

const MODULES = [
  // Login
  './Login.jsx',

  // Guest
  './Guest/src/pages/Dashboard.jsx',
  './Guest/src/pages/profile.jsx',
  './Guest/src/pages/Book.jsx',
  './Guest/src/pages/BookingHistory.jsx',
  './Guest/src/pages/Branches.jsx',
  './Guest/src/pages/CurrentBookings.jsx',
  './Guest/src/pages/GuestViewBill.jsx',
  './Guest/src/pages/Register.jsx',
  './Guest/src/pages/RoomsAndServices.jsx',
  './Guest/src/pages/Service.jsx',

  // Management
  './Management/Dashboard.jsx',
  './Management/Report1.jsx',
  './Management/Report2.jsx',
  './Management/Report3.jsx',
  './Management/Report4.jsx',
  './Management/Report5.jsx',

  // Admin
  './Admin/Dashboard.jsx',
  './Admin/ViewDiscounts.jsx',
  './Admin/AddDiscounts.jsx',
  './Admin/ViewTaxes.jsx',
  './Admin/AddTaxes.jsx',
  './Admin/ManageStaff.jsx',
  './Admin/ViewLogs.jsx',

  // Service Office
  './ServiceOffice/Dashboard.jsx',
  './ServiceOffice/ViewDueServices.jsx',
  './ServiceOffice/ViewServiceHistory.jsx',
  './ServiceOffice/UpdateServiceTable.jsx',

  // FrontDesk
  './FrontDeskOffice/Dashboard.jsx',
];

export default function DevImportCheck() {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);

  async function runChecks() {
    setRunning(true);
    const res = [];
    for (const mod of MODULES) {
      try {
        // dynamic import to trigger module evaluation
        const imported = await import(/* @vite-ignore */ mod);
        res.push({ module: mod, status: 'ok', info: imported?.default ? 'default export' : 'module' });
      } catch (err) {
        res.push({ module: mod, status: 'error', error: String(err && (err.stack || err.message || err)) });
        // keep going to collect all errors
      }
    }
    setResults(res);
    setRunning(false);
  }

  useEffect(() => {
    runChecks();
  }, []);

  const firstError = results.find(r => r.status === 'error');

  return (
    <div style={{ padding: 24, fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <h2>Dev import check</h2>
      <p>This page dynamically imports frontend modules and reports the first import error.</p>
      <button onClick={runChecks} disabled={running} style={{ marginBottom: 12 }}>
        {running ? 'Running...' : 'Run import check'}
      </button>

      {firstError ? (
        <div style={{ border: '1px solid #c00', padding: 12, marginBottom: 12, background: '#fff5f5' }}>
          <strong>First error:</strong>
          <div>Module: {firstError.module}</div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{firstError.error}</pre>
        </div>
      ) : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Module</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Status</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Info / Error</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.module}>
              <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{r.module}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{r.status}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{r.status === 'ok' ? r.info : <pre style={{ whiteSpace: 'pre-wrap' }}>{r.error}</pre>}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 12 }}>If any module shows an error, paste the module and the error here and I'll patch it.</p>
    </div>
  );
}

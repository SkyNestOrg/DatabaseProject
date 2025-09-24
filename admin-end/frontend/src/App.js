import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StaffRegistrationForm from "./components/StaffRegistrationForm";
import StaffManagement from "./components/StaffManagementPage";

function App() {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/staff/register" replace />} />
            <Route path="/staff/register" element={<StaffRegistrationForm />} />
            <Route path="/staff/manage" element={<StaffManagement />} />
            <Route path="/dashboard" element={<div className="card"><h3>Dashboard (coming soon)</h3></div>} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

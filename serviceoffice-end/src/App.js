import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DueServices from './pages/DueServices';
import ServiceHistory from './pages/ServiceHistory';
import './App.css';
import Navbar from './components/layout/Navbar';
import ProtectedRoutes from './components/auth/ProtectedRoutes';

function AppRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-wrapper fade-in">
      <Routes location={location}>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
        <Route path="/due-services" element={<ProtectedRoutes><DueServices /></ProtectedRoutes>} />
        <Route path="/service-history" element={<ProtectedRoutes><ServiceHistory /></ProtectedRoutes>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
  );
}

export default App;
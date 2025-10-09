import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DueServices from "./pages/DueServices";
import ServiceHistory from "./pages/ServiceHistory";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

function AppRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-wrapper fade-in">
      <Routes location={location}>
        <Route path="/login" element={
          <ErrorBoundary>
            <Login />
          </ErrorBoundary>
        } />
        <Route
          path="/dashboard"
          element={
            <ErrorBoundary>
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            </ErrorBoundary>
          }
        />
        <Route
          path="/due-services"
          element={
            <ErrorBoundary>
              <ProtectedRoutes>
                <DueServices />
              </ProtectedRoutes>
            </ErrorBoundary>
          }
        />
        <Route
          path="/service-history"
          element={
            <ErrorBoundary>
              <ProtectedRoutes>
                <ServiceHistory />
              </ProtectedRoutes>
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <Router>
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;

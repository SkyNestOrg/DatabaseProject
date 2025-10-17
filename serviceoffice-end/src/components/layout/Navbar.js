import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { logout, isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // hide navbar on login page
  if (location.pathname === "/login") return null;

  const onLogoutClick = () => setConfirmOpen(true);
  const confirmLogout = () => {
    setConfirmOpen(false);
    logout();
  };
  const cancelLogout = () => setConfirmOpen(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <h1>🏨 Service Office</h1>
          </div>

          <button
            className="menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
            <li>
              <Link to="/dashboard" onClick={closeMobileMenu}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/due-services" onClick={closeMobileMenu}>
                Due Services
              </Link>
            </li>
            <li>
              <Link to="/service-history" onClick={closeMobileMenu}>
                Service History
              </Link>
            </li>
            <li>
              <Link to="/service-management" onClick={closeMobileMenu}>
                Manage Services
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="branch-display">
                  {user?.branch_id ? `Branch: ${user.branch_id}` : ""}
                </li>
                <li>
                  <button
                    className="btn-logout"
                    onClick={() => {
                      onLogoutClick();
                      closeMobileMenu();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {confirmOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="btn cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn confirm" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

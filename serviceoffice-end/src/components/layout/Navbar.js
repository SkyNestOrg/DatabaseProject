import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { logout, isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // hide navbar on login page
  if (location.pathname === "/login") return null;

  const onLogoutClick = () => setConfirmOpen(true);
  const confirmLogout = () => {
    setConfirmOpen(false);
    logout();
  };
  const cancelLogout = () => setConfirmOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <h1>🏨 Service Office</h1>
          </div>

          <ul className="nav-links">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/due-services">Due Services</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="branch-display">
                  {user?.branch_id ? `Branch: ${user.branch_id}` : ""}
                </li>
                <li>
                  <button className="btn-logout" onClick={onLogoutClick}>
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

// <li><Link to="/service-history">Service History</Link></li>
export default Navbar;

import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navClass = ({ isActive }) => isActive ? "menu-item active" : "menu-item";

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>SkyNest Hotels</h1>
        <span>ADMIN PORTAL</span>
      </div>

      <div className="menu">
        <NavLink className={navClass} to="/dashboard">
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink className={navClass} to="/staff/register">
          <i className="fas fa-user-plus"></i>
          <span>Staff Registration</span>
        </NavLink>

        <NavLink className={navClass} to="/staff/manage">
          <i className="fas fa-users"></i>
          <span>Manage Staff</span>
        </NavLink>

        <div className="menu-item">
          <i className="fas fa-clipboard-list"></i>
          <span>View Logs</span>
        </div>
        <div className="menu-item">
          <i className="fas fa-tags"></i>
          <span>Discounts</span>
        </div>
        <div className="menu-item">
          <i className="fas fa-receipt"></i>
          <span>Taxes & Charges</span>
        </div>
        <div className="menu-item">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

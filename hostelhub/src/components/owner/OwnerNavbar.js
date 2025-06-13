import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ToggleButton from '../common/ToggleButton';

const OwnerNavbar = ({ searchTerm, setSearchTerm }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/";
    };
  
  return (
      <nav className="userNavbar ownerNavbar" style={{ padding: "1rem"}}>
        <div className="left-nav">
          <Link to="/owner" style={{ marginRight: "1rem", color: location.pathname === '/owner'?'var(--link-active)':'var(--nav-link-color)' }}>
            Home
          </Link>
          <Link  to="/owner/myHostels" style={{ marginRight: "1rem", color: location.pathname === '/owner/myHostels'?'var(--link-active)':'var(--nav-link-color)' }}>
            My Hostels
          </Link>
          <Link to="/owner/manageHostels" style={{ marginRight: "1rem", color: location.pathname === '/owner/manageHostels'?'var(--link-active)':'var(--nav-link-color)' }}>
            Manage Hostels
          </Link>
          <Link style={{ color: location.pathname === '/owner/profile'?'var(--link-active)':'var(--nav-link-color)'}} to="/owner/profile">Profile</Link>
        </div>
        <div className="right-nav">
          <ToggleButton/>
          <input
            type="text"
            placeholder="Search"
            onClick={() =>
              navigate(
                `/${
                  localStorage.getItem("role") === "owner" ? "owner" : "user"
                }`
              )
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm in App.js
            style={{ marginBottom: "1rem" }}
          />
          <button onClick={()=>{setShowLogoutModal(true)}}>Logout</button>
          {showLogoutModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Confirm Logout</h3>
      <p>Are you sure you want to logout?</p>
      <div className="modal-actions">
        <button onClick={handleLogout} className="confirm-btn">Yes, Logout</button>
        <button onClick={() => setShowLogoutModal(false)} className="cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
)}

        </div>
      </nav>
  )
}

export default OwnerNavbar

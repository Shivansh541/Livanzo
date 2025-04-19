import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OwnerNavbar = ({ searchTerm, setSearchTerm }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/";
    };
  
  return (
      <nav className="userNavbar ownerNavbar" style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
        <div className="left-nav">
          <Link to="/owner" style={{ marginRight: "1rem", color: location.pathname === '/owner'?'blue':'black' }}>
            Home
          </Link>
          <Link  to="/owner/myHostels" style={{ marginRight: "1rem", color: location.pathname === '/owner/myHostels'?'blue':'black' }}>
            My Hostels
          </Link>
          <Link to="/owner/manageHostels" style={{ marginRight: "1rem", color: location.pathname === '/owner/manageHostels'?'blue':'black' }}>
            Manage Hostels
          </Link>
          <Link style={{ color: location.pathname === '/owner/profile'?'blue':'black'}} to="/owner/profile">Profile</Link>
        </div>
        <div className="right-nav">
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
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
  )
}

export default OwnerNavbar

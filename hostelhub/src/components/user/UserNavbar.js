import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ToggleButton from '../common/ToggleButton';

const UserNavbar = ({ searchTerm, setSearchTerm }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/';
    };
  return (
    <nav className='userNavbar'>
    <div className="left-nav">
    <Link style = {{color: location.pathname==='/user'?'var(--link-active)':'var(--nav-link-color)'}} to="/user">Home</Link>
    <Link style = {{color: location.pathname==='/user/favorites'?'var(--link-active)':'var(--nav-link-color)'}} to="/user/favorites">Favorites</Link>
    <Link style = {{color: location.pathname==='/user/profile'?'var(--link-active)':'var(--nav-link-color)'}} to="/user/profile">Profile</Link>
    </div>
    <div className="right-nav">
      <ToggleButton/>
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      // Navigate to search page with searchTerm and role in App.js`)}
      onChange={(e) => {setSearchTerm(e.target.value);navigate(`/${localStorage.getItem('role') === 'owner'?'owner':'user'}`)}} // Update searchTerm in App.js
      
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

export default UserNavbar

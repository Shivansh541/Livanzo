import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToggleButton from "./ToggleButton";
import NavLinks from './NavLinks';
import '../common/css/rightnav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

const RightNav = ({ searchTerm, setSearchTerm }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'guest';

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (role === 'renter') navigate('/user/allhostels');
    else if (role === 'owner') navigate('/owner/allhostels');
    else navigate('/allhostels');
  };

  const renderLogoutModal = () => (
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
  );

  if (role === "guest") {
    return (
      <div className="right-nav">
      <div class="search-bar">
        <FontAwesomeIcon className='search-button' icon = {faMagnifyingGlass}/>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
        <ToggleButton />
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  return (
    <div className="right-nav">
      <div class="search-bar">
        <FontAwesomeIcon className='search-button' icon = {faMagnifyingGlass}/>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <ToggleButton />
      <FontAwesomeIcon
        icon={faBars}
        className='menu-button'
        onClick={() => setShowMenu(true)}
      />
      {showMenu && (
        <div className="hamMenu" onClick={(e) => {
          if (e.target.classList.contains('hamMenu')) setShowMenu(false);
        }}>
          <div className="hamburger-menu" onClick={(e) => e.stopPropagation()}>
            <FontAwesomeIcon
              icon={faXmark}
              className='close-menu'
              onClick={() => setShowMenu(false)}
            />
            <NavLinks role={role} setShowMenu={setShowMenu} />
            <button className='hambtn' onClick={() => setShowLogoutModal(true)}>Logout</button>
          </div>
        </div>
      )}

      <button className='navbtn' onClick={() => setShowLogoutModal(true)}>Logout</button>

      {showLogoutModal && renderLogoutModal()}
    </div>
  );
};

export default RightNav;

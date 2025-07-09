import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToggleButton from "./ToggleButton";
import NavLinks from './NavLinks';
import '../common/css/rightnav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faM, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const RightNav = ({ searchTerm, setSearchTerm }) => {
  const [isClosing, setIsClosing] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'guest';
  const handleCloseMenu = () => {
    setIsClosing(true); // Trigger exit animation
    setTimeout(() => {
      setShowMenu(false); // Unmount after animation
      setIsClosing(false); // Reset
    }, 300); // Match animation duration
  };

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
      <AnimatePresence>

        {showSearch && <motion.div
          key="searchInputWrapper"
          layout
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onBlur={() => setShowSearch(false)} class={`search-bar`}>
          <FontAwesomeIcon onClick={() => setShowSearch(true)} icon={faMagnifyingGlass} />
          <motion.input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
        </motion.div>}
      </AnimatePresence>
      {!showSearch && <FontAwesomeIcon onClick={() => setShowSearch(true)} className='search-button' icon={faMagnifyingGlass} />}
        <ToggleButton />
        <button onClick={() => navigate("/login")}>Login</button>
                <AnimatePresence>

        {showSearch && <motion.div
          key="searchInputWrapper"
          layout
          initial={{ transform:"translateY(-100%)", opacity: 0 }}
          animate={{ transform:"translateY(0)", opacity: 1 }}
          exit={{ transform:"translateY(-100%)", opacity: 0 }}
          transition={{ duration: 0.5 }} 
          onBlur={() => setShowSearch(false)} class={`search-bar phone`}>
          <FontAwesomeIcon onClick={() => setShowSearch(true)} icon={faMagnifyingGlass} />
          <motion.input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
        </motion.div>}
      </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="right-nav">
      <AnimatePresence>

        {showSearch && <motion.div
          key="searchInputWrapper"
          layout
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onBlur={() => setShowSearch(false)} class={`search-bar`}>
          <FontAwesomeIcon onClick={() => setShowSearch(true)} icon={faMagnifyingGlass} />
          <motion.input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
        </motion.div>}
      </AnimatePresence>
      {!showSearch && <FontAwesomeIcon onClick={() => setShowSearch(true)} className='search-button' icon={faMagnifyingGlass} />}
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
          <div className={`hamburger-menu ${isClosing ? 'hamburger-exit' : ''}`} onClick={(e) => e.stopPropagation()}>
            <FontAwesomeIcon
              icon={faXmark}
              className='close-menu'
              onClick={() => handleCloseMenu()}
            />
            <NavLinks role={role} handleCloseMenu={handleCloseMenu} />
            <button className='hambtn' onClick={() => setShowLogoutModal(true)}>Logout</button>
          </div>
        </div>
      )}

      <button className='navbtn' onClick={() => setShowLogoutModal(true)}>Logout</button>

      {showLogoutModal && renderLogoutModal()}
        <AnimatePresence>

        {showSearch && <motion.div
          key="searchInputWrapper"
          layout
          initial={{ transform:"translateY(-100%)", opacity: 0 }}
          animate={{ transform:"translateY(0)", opacity: 1 }}
          exit={{ transform:"translateY(-100%)", opacity: 0 }}
          transition={{ duration: 0.5 }} 
          onBlur={() => setShowSearch(false)} class={`search-bar phone`}>
          <FontAwesomeIcon onClick={() => setShowSearch(true)} icon={faMagnifyingGlass} />
          <motion.input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
        </motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default RightNav;

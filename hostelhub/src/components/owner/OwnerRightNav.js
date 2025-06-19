import React, { useState } from 'react'
import ToggleButton from "../common/ToggleButton";
import {  useNavigate } from 'react-router-dom';
import '../common/css/rightnav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import OwnerNavLinks from './OwnerNavLinks';
const RightNav = ({searchTerm,setSearchTerm}) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showMenu,setShowMenu] = useState(false);
  const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };
      const handleClick = ()=>{
      if(localStorage.getItem('role') === 'renter'){
        navigate('/user/allhostels')
      }
      else if(localStorage.getItem('role') === 'owner'){
        navigate('/owner/allhostels')
      }
      else{
        navigate('/allhostels') // fallback or guest
      }
    }
  return (
      <div className="right-nav">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value);handleClick()}} // Update searchTerm in App.js
        />
        <ToggleButton />
        <FontAwesomeIcon onClick={()=>{setShowMenu(!showMenu)}} className='menu-button' icon={faBars} />
        {showMenu && (
          <div onClick={(e) => {
      // If the click target is the overlay itself (not the modal content), close it
      if (e.target.classList.contains('hamMenu')) {
        setShowMenu(false);
      }
    }} className="hamMenu">

          <div onClick={(e)=>e.stopPropagation()} className="hamburger-menu">
            <FontAwesomeIcon onClick={()=>{setShowMenu(!showMenu)}} className='close-menu' icon={faXmark}/>
            <OwnerNavLinks setShowMenu = {setShowMenu}/>
          <button className='hambtn'
          onClick={() => {
            setShowLogoutModal(true);
          }}
          >
          Logout
        </button>
        {showLogoutModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
              <div className="modal-actions">
                <button onClick={handleLogout} className="confirm-btn">
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="cancel-btn"
                  >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
        </div>
)}
        <button className='navbtn'
          onClick={() => {
            setShowLogoutModal(true);
          }}
        >
          Logout
        </button>
        {showLogoutModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
              <div className="modal-actions">
                <button onClick={handleLogout} className="confirm-btn">
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default RightNav

import React from 'react'
import { useNavigate } from 'react-router-dom';
import ToggleButton from '../common/ToggleButton';

const GuestNavbar = ({ searchTerm, setSearchTerm }) => {
    const navigate = useNavigate();
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
    <nav className='userNavbar guestNavbar'>

    <div className="left-nav">
      <p className='logo'>Livanzo</p>
    </div>
    <div className="right-nav">
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      // Navigate to search page with searchTerm and role in App.js`)}
      onChange={(e) => {setSearchTerm(e.target.value);handleClick()}} // Update searchTerm in App.js
      />
      <ToggleButton/>
    <button onClick={()=>{navigate('/login')}}>Login</button>
      </div>
  </nav>
  )
}

export default GuestNavbar

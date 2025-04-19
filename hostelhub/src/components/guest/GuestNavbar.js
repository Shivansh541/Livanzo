import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const GuestNavbar = ({ searchTerm, setSearchTerm }) => {
    const navigate = useNavigate();
    const handleClick = ()=>{
      if(localStorage.getItem('role') === 'renter'){
        navigate('/user')
      }
      else if(localStorage.getItem('role') === 'owner'){
        navigate('/owner')
      }
      else{
        navigate('/') // fallback or guest
      }
    }
  return (
    <nav className='userNavbar' style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
    <div className="left-nav">
      <Link to="/" style={{ marginRight: '1rem',color: 'blue' }}>Home</Link>
    </div>
    <div className="right-nav">

    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
       // Navigate to search page with searchTerm and role in App.js`)}
      onChange={(e) => {setSearchTerm(e.target.value);handleClick()}} // Update searchTerm in App.js
      style={{ marginBottom: '1rem' }}
      />
    <button onClick={()=>{navigate('/login')}}>Login</button>
      </div>
  </nav>
  )
}

export default GuestNavbar

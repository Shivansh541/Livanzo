import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

const UserNavbar = ({ searchTerm, setSearchTerm }) => {
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
    <Link style = {{color: location.pathname==='/user'?'blue':'black'}} to="/user">Home</Link>
    <Link style = {{color: location.pathname==='/user/favorites'?'blue':'black'}} to="/user/favorites">Favorites</Link>
    <Link style = {{color: location.pathname==='/user/profile'?'blue':'black'}} to="/user/profile">Profile</Link>
    </div>
    <div className="right-nav">
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      // Navigate to search page with searchTerm and role in App.js`)}
      onChange={(e) => {setSearchTerm(e.target.value);navigate(`/${localStorage.getItem('role') === 'owner'?'owner':'user'}`)}} // Update searchTerm in App.js
      
    />
    <button onClick={handleLogout}>Logout</button>
    </div>
  </nav>
  )
}

export default UserNavbar

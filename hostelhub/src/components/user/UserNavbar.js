import React, { useEffect, useState } from 'react'
import UserRightNav from './UserRightNav';
import UserNavLinks from './UserNavLinks';

const UserNavbar = ({ searchTerm, setSearchTerm }) => {
    const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, []);
  return (
    <nav className='userNavbar'>
    <div className="left-nav">
      <img src={theme === "light"?"/logo light.png":"/logo dark.png"} alt=""/>
      <div className="navlinks">
        <UserNavLinks/>
      </div>
    </div>
    <UserRightNav searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
  </nav>
  )
}

export default UserNavbar

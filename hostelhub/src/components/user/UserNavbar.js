import React from 'react'
import UserRightNav from './UserRightNav';
import UserNavLinks from './UserNavLinks';

const UserNavbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <nav className='userNavbar'>
    <div className="left-nav">
      <p className="logo">Livanzo</p>
      <div className="navlinks">
        <UserNavLinks/>
      </div>
    </div>
    <UserRightNav searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
  </nav>
  )
}

export default UserNavbar

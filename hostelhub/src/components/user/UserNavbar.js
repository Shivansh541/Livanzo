import React from 'react'
import UserRightNav from './UserRightNav';
import UserNavLinks from './UserNavLinks';
import Logo from '../common/Logo';

const UserNavbar = ({ searchTerm, setSearchTerm }) => {

  return (
    <nav className='userNavbar'>
    <div className="left-nav">
      <Logo/>
      <div className="navlinks">
        <UserNavLinks/>
      </div>
    </div>
    <UserRightNav searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
  </nav>
  )
}

export default UserNavbar

// components/user/UserDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import GuestNavbar from './GuestNavbar';

const Guest = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className='guestContainer'>
      <GuestNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Guest;

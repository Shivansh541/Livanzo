// components/user/UserDashboard.js
import React from 'react';
import { Outlet} from 'react-router-dom';
import './css/userDashboard.css';
import UserNavbar from './UserNavbar';

const UserDashboard = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className='userContainer'>
      <UserNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      <div className='userContent'>
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;

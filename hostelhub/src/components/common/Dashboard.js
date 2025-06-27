// components/user/UserDashboard.js
import React from 'react';
import { Outlet} from 'react-router-dom';
import './css/dashboard.css';
import Navbar from './Navbar';

const Dashboard = ({ searchTerm, setSearchTerm }) => {
  const role = localStorage.getItem('role');

  return (
    <div className={role === 'owner' ? 'ownerDashboard' : role === 'renter'? 'userContainer':'guestContainer'}>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="userContent">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

// components/owner/OwnerDashboard.js
import React from "react";
import {Outlet} from "react-router-dom";
import OwnerNavbar from "./OwnerNavbar";

const OwnerDashboard = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="ownerDashboard">
      <OwnerNavbar searchTerm = {searchTerm} setSearchTerm= {setSearchTerm}/>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default OwnerDashboard;

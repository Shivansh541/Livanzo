import React from "react";
import OwnerRightNav from "./OwnerRightNav";
import OwnerNavLinks from "./OwnerNavLinks";
import Logo from "../common/Logo";

const OwnerNavbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <nav className="userNavbar ownerNavbar">
      <div className="left-nav">
        <Logo/>
        <div className="navlinks">
          <OwnerNavLinks/>
        </div>
      </div>
      <OwnerRightNav searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}/>
    </nav>
  );
};

export default OwnerNavbar;

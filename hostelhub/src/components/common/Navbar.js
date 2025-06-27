import React from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import RightNav from "./RightNav";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const role = localStorage.getItem("role") || "guest";


  return (
    <nav className={`userNavbar ${role === "owner" ? "ownerNavbar" : ""} ${role === "guest" ? "guestNavbar" : ""}`}>
      <div className="left-nav">
        <Logo />
        {role !== "guest" && (
          <div className="navlinks">
            <NavLinks role={role} />
          </div>
        )}
      </div>
      <RightNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </nav>
  );
};

export default Navbar;

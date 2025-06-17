import React from 'react'
import { Link, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faHouse,
  faPlusCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
const OwnerNavLinks = ({setShowMenu}) => {
  const location = useLocation();

  return (
        <>
          <Link onClick = {()=>setShowMenu?.(false)}
            to="/owner"
            style={{
              color:
                location.pathname === "/owner"
                  ? "var(--link-active)"
                  : "var(--nav-link-color)",
            }}
          >
            <FontAwesomeIcon icon={faHouse} />
            <p className="linkName">Home</p>
          </Link>
          <Link onClick = {()=>setShowMenu?.(false)}
            to="/owner/myHostels"
            style={{
              color:
                location.pathname === "/owner/myHostels"
                  ? "var(--link-active)"
                  : "var(--nav-link-color)",
            }}
          >
            <FontAwesomeIcon icon={faBuilding} />
            <p className="linkName">My Hostels</p>
          </Link>
          <Link onClick = {()=>setShowMenu?.(false)}
            to="/owner/manageHostels"
            style={{
              color:
                location.pathname === "/owner/manageHostels"
                  ? "var(--link-active)"
                  : "var(--nav-link-color)",
            }}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            <p className="linkName">Add Hostel</p>
          </Link>
          <Link onClick = {()=>setShowMenu?.(false)}
            style={{
              color:
                location.pathname === "/owner/profile"
                  ? "var(--link-active)"
                  : "var(--nav-link-color)",
            }}
            to="/owner/profile"
          >
            <FontAwesomeIcon icon={faUser} />
            <p className="linkName">Profile</p>
          </Link>
        </>
  )
}

export default OwnerNavLinks

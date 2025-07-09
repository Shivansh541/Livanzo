import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faHouse,
  faUser,
  faPlusCircle,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';

const UserNavLinks = ({ handleCloseMenu, role }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = {
    renter: [
      { to: "/user", label: "Home", icon: faHouse },
      { to: "/user/favorites", label: "Favorites", icon: faHeart },
      { to: "/user/profile", label: "Profile", icon: faUser },
    ],
    owner: [
      { to: "/owner", label: "Home", icon: faHouse },
      { to: "/owner/myHostels", label: "My", icon: faBuilding },
      { to: "/owner/manageHostels", label: "Add", icon: faPlusCircle },
      { to: "/owner/profile", label: "Profile", icon: faUser },
    ]
  };

  return (
    <>
      {navLinks[role]?.map(({ to, label, icon }) => (
        <Link
          key={to}
          onClick={() => handleCloseMenu?.()}
          to={to}
          style={{
            color: isActive(to) ? 'var(--link-active)' : ''
          }}
        >
          <FontAwesomeIcon icon={icon} />
          <p className='linkName'>{label}</p>
        </Link>
      ))}
    </>
  );
};

export default UserNavLinks;

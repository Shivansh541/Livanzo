import React from 'react'
import { Link, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
const UserNavLinks = () => {
  const location = useLocation();

  return (
        <>
              <Link style = {{color: location.pathname==='/user'?'var(--link-active)':'var(--nav-link-color)'}} to="/user">
                <FontAwesomeIcon icon={faHouse} /><p className='linkName'>Home</p>
              </Link>
              <Link style = {{color: location.pathname==='/user/favorites'?'var(--link-active)':'var(--nav-link-color)'}} to="/user/favorites">
              <FontAwesomeIcon icon={faHeart}/><p className='linkName'>Favorites</p>
              </Link>
              <Link style = {{color: location.pathname==='/user/profile'?'var(--link-active)':'var(--nav-link-color)'}} to="/user/profile">
              <FontAwesomeIcon icon={faUser}/><p className='linkName'>Profile</p>
              </Link>
        </>
  )
}

export default UserNavLinks;
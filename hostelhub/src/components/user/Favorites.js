import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../common/css/allHostel.css';

const Favorites = ({ user, allhostels }) => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    if (user?.favorites && allhostels?.length) {
      const favorites = allhostels.filter(h =>
        user.favorites.includes(h._id)
      );
      setHostels(favorites);
    }
  }, [user, allhostels]);
  const handleClick = (id) => {
    const role = localStorage.getItem("role");
    if (role === "owner") {
      navigate(`/owner/hostel/${id}`);
    } else if (role === "renter") {
      navigate(`/user/hostel/${id}`);
    } else {
      navigate('/login');
    }
  };
  return (
    <div className="all-hostels-container">
      {hostels?.length > 0 ? (
        <div className="hostel-grid">
          {hostels.map(h => (
            <div
              key={h._id}
              className="hostel-card"
              onClick={() => handleClick(h._id)}
            >
              <img src={h.images[0].startsWith('http')?h.images[0]:`${process.env.REACT_APP_BACKEND_URL}${h.images[0]}`} alt="No img"/>
              <h3>{h.name}</h3>
              <p>{h.description}</p>
              <p>Rent: ₹{h.rent}</p>
              <p>City: {h.address?.city}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hostels available</p>
      )}
    </div>
  );
};

export default Favorites;

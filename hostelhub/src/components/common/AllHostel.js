import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/allHostel.css';

const AllHostels = ({ hostels }) => {
  const navigate = useNavigate();

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
              <img src={h.images[0]} alt="No img"/>
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

export default AllHostels;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyHostel = () => {
  const navigate = useNavigate();
  const [myHostels, setMyHostels] = useState([]);
  useEffect(() => {
    const fetchMyHostels = async () => {
      const res = await fetch('process.env.REACT_APP_BACKEND_URL/api/hostel/myHostels', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      const data = await res.json();
      setMyHostels(data);
    };
    fetchMyHostels();
  }, []);

  const handleClick = (id) => {
    const role = localStorage.getItem('role');
    if (role === 'owner') {
      navigate(`/owner/hostel/${id}`);
    } else if (role === 'renter') {
      navigate(`/user/hostel/${id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="all-hostels-container">
      <h2>My Hostels</h2>
      {myHostels?.length > 0 ? (
        <div className="hostel-grid">
          {myHostels.map((h) => (
            <div key={h._id} className="hostel-card">
              <img onClick={() => handleClick(h._id)} src={h.images[0].startsWith('http')?h.images[0]:`process.env.REACT_APP_BACKEND_URL${h.images[0]}`} alt="No img" />
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

export default MyHostel;

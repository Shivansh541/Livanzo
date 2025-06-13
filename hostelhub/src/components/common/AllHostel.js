import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/allHostel.css';

const AllHostels = ({ hostels }) => {
  const navigate = useNavigate();
  const BACKEND_URL = 'http://localhost:5000';

  const [filteredHostels, setFilteredHostels] = useState([]);
  const [filters, setFilters] = useState({
    rentMin: '',
    rentMax: '',
    roomType: '',
    allowedFor: '',
    availability: '',
    facilities: '',
    nearbyColleges: '',
    minRating: '',
  });

  useEffect(() => {
    setFilteredHostels(hostels);
  }, [hostels]);

  useEffect(() => {
    const result = hostels?.filter((h) => {
      const facilitiesArray = filters.facilities
        ? filters.facilities.toLowerCase().split(',').map(f => f.trim())
        : [];

      const collegesArray = filters.nearbyColleges
        ? filters.nearbyColleges.toLowerCase().split(',').map(c => c.trim())
        : [];

      const facilitiesMatch = facilitiesArray.length === 0 || facilitiesArray.some(fac =>
        h.facilities?.some(hf => hf.toLowerCase().includes(fac))
      );

      const collegeMatch = collegesArray.length === 0 || collegesArray.some(col =>
        h.nearbyColleges?.some(nc => nc.toLowerCase().includes(col))
      );

      return (
        (filters.rentMin === '' || h.rent >= parseInt(filters.rentMin)) &&
        (filters.rentMax === '' || h.rent <= parseInt(filters.rentMax)) &&
        (filters.roomType === '' || h.roomType === filters.roomType) &&
        (filters.allowedFor === '' || h.allowedFor === filters.allowedFor) &&
        (filters.availability === '' || (filters.availability === 'Available' ? h.isAvailable : !h.isAvailable)) &&
        (filters.minRating === '' || h.rating >= parseFloat(filters.minRating)) &&
        facilitiesMatch &&
        collegeMatch
      );
    });

    setFilteredHostels(result);
  }, [filters, hostels]);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="all-hostels-container">
      <div className="filter-section">
        <input type="number" name="rentMin" placeholder="Min Rent" onChange={handleFilterChange} />
        <input type="number" name="rentMax" placeholder="Max Rent" onChange={handleFilterChange} />
        <select name="roomType" onChange={handleFilterChange}>
          <option value="">Room Type</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Triple">Triple</option>
          <option value="Dormitory">Dormitory</option>
        </select>
        <select name="allowedFor" onChange={handleFilterChange}>
          <option value="">Allowed For</option>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
          <option value="Both">Both</option>
          <option value="Family">Family</option>
        </select>
        <select name="availability" onChange={handleFilterChange}>
          <option value="">Availability</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>
        <input type="text" name="facilities" placeholder="Facilities (e.g., wifi, food)" onChange={handleFilterChange} />
        <input type="text" name="nearbyColleges" placeholder="Nearby Colleges (e.g., IIT, NIT)" onChange={handleFilterChange} />
        <input type="number" name="minRating" placeholder="Min Rating" min="1" max="5" onChange={handleFilterChange} />
      </div>

      {filteredHostels?.length > 0 ? (
        <div className="hostel-grid">
          {filteredHostels.map(h => (
            <div key={h._id} className="hostel-card" onClick={() => handleClick(h._id)}>
              <img
  src={
    h.images.length > 0
      ? h.images[0].startsWith('http')
        ? h.images[0]
        : `${BACKEND_URL}${h.images[0]}`
      : 'https://via.placeholder.com/200x150?text=No+Image'
  }
  alt="hostel"
  className="hostel-image"
/>
              <h3>{h.name}</h3>
              <p>{h.description}</p>
              <p>Rent: ₹{h.rent}</p>
              <p>City: {h.address?.city}</p>
              <p>Nearby Colleges: {h.nearbyColleges?.join(', ')}</p>
              <p>Facilities: {h.facilities?.join(', ')}</p>
              <p>Rating: {h.rating?.toFixed(1)} ⭐</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hostels found</p>
      )}
    </div>
  );
};

export default AllHostels;

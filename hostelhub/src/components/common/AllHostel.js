import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/allHostel.css';

const AllHostels = ({ hostels }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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

  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    setFilteredHostels(hostels);
  }, [hostels]);

  useEffect(() => {
    let result = hostels?.filter((h) => {
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

    switch (sortOption) {
      case 'rentLowHigh':
        result.sort((a, b) => a.rent - b.rent);
        break;
      case 'rentHighLow':
        result.sort((a, b) => b.rent - a.rent);
        break;
      case 'ratingHighLow':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'ratingLowHigh':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'nameAZ':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameZA':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        break;
    }

    setFilteredHostels(result);
  }, [filters, hostels, sortOption]);

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

  const handleClearFilters = () => {
    setFilters({
      rentMin: '',
      rentMax: '',
      roomType: '',
      allowedFor: '',
      availability: '',
      facilities: '',
      nearbyColleges: '',
      minRating: '',
    });
  };

  return (<>
    <div className="all-hostels-container">
      {/* FILTER + SORT SECTION */}
      <div className="filter-section">
        <button className="filter-button" onClick={() => setShowModal(true)}>Filters</button>

        <select onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="rentLowHigh">Rent: Low to High</option>
          <option value="rentHighLow">Rent: High to Low</option>
          <option value="ratingHighLow">Rating: High to Low</option>
          <option value="ratingLowHigh">Rating: Low to High</option>
          <option value="nameAZ">Name: A-Z</option>
          <option value="nameZA">Name: Z-A</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

      {/* FILTER MODAL */}
      {showModal && (
        <div className="modal-overlay"
            onClick={(e) => {
      // If the click target is the overlay itself (not the modal content), close it
      if (e.target.classList.contains('modal-overlay')) {
        setShowModal(false);
      }
    }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Filter Options</h2>

            <input type="number" name="rentMin" placeholder="Min Rent" value={filters.rentMin} onChange={handleFilterChange} />
            <input type="number" name="rentMax" placeholder="Max Rent" value={filters.rentMax} onChange={handleFilterChange} />

            <select name="roomType" value={filters.roomType} onChange={handleFilterChange}>
              <option value="">Room Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Dormitory">Dormitory</option>
            </select>

            <select name="allowedFor" value={filters.allowedFor} onChange={handleFilterChange}>
              <option value="">Allowed For</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Both">Both</option>
              <option value="Family">Family</option>
            </select>

            <select name="availability" value={filters.availability} onChange={handleFilterChange}>
              <option value="">Availability</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>

            <input type="text" name="facilities" placeholder="Facilities (e.g., wifi, food)" value={filters.facilities} onChange={handleFilterChange} />
            <input type="text" name="nearbyColleges" placeholder="Nearby Colleges (e.g., IIT, NIT)" value={filters.nearbyColleges} onChange={handleFilterChange} />
            <input type="number" name="minRating" placeholder="Min Rating" min="1" max="5" value={filters.minRating} onChange={handleFilterChange} />

            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Close</button>
              <button onClick={() => setShowModal(false)}>Apply Filters</button>
              <button className="clear-btn" onClick={handleClearFilters}>Clear Filters</button>
            </div>
          </div>
        </div>
      )}

      </div>
      {/* HOSTEL LIST */}
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
              {h.description && <p>{h.description}</p>}
              <p>Rent: ₹{h.rent}</p>
              <p>City: {h.address?.city}</p>
              {h.nearbyColleges[0]!=="" && <p>Nearby Colleges: {h.nearbyColleges?.join(', ')}</p>}
              {h.facilities[0]!=="" && <p>Facilities: {h.facilities?.join(', ')}</p>}
              {h.reviews.length>0 && <p>Rating: {h.rating?.toFixed(1)} ⭐</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>No hostels found</p>
      )}
    </div></>
  );
};

export default AllHostels;

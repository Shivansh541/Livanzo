import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/home.css';

const Home = ({ hostels }) => {
  const navigate = useNavigate();
  const BACKEND_URL = 'http://localhost:5000';
  const [sliderHostels, setSliderHostels] = useState([]);
   useEffect(() => {
    // Show only top 6-8 hostels (latest or highest rated)
    const sorted = [...hostels]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    setSliderHostels(sorted);
  }, [hostels]);

const sliderRef = useRef();

const scrollSlider = (direction) => {
  const scrollAmount = 300; // Card width + margin
  if (sliderRef.current) {
    sliderRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  }
}


  const handleViewMore = () => {
    const role = localStorage.getItem("role");
    if (role === "owner") {
      navigate(`/owner/allhostels`);
    } else if (role === "renter") {
      navigate(`/user/allhostels`);
    } else {
      navigate('/allhostels');
    }
  };
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
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Find Your Perfect Stay with <span>Livanzo</span></h1>
        <p>Explore hostels, rooms, and flats designed for students and professionals across India.</p>
        <button onClick={handleViewMore}>Browse All Hostels</button>
      </section>

      {/* Hostel Slider */}
      {sliderHostels?.length>0 && 
<section className="slider-section">
  <h2>Top Rated Hostels</h2>

  <div className="slider-container">
    <button className="slider-btn left" onClick={() => scrollSlider(-1)}>&lt;</button>

    <div className="slider-track" ref={sliderRef}>
      {hostels.slice(0, 8).map((h) => (
        <div key={h._id} className="slider-card" onClick={() => handleClick(h._id)}>
          <img
            src={
              h.images?.[0]
                ? h.images[0].startsWith('http')
                  ? h.images[0]
                  : `${BACKEND_URL}${h.images[0]}`
                : 'https://via.placeholder.com/250x150?text=No+Image'
            }
            alt="hostel"
          />
          <h3>{h.name}</h3>
          <p>{h.city || h.address?.city}</p>
          <span>₹{h.rent}/mo</span>
        </div>
      ))}
    </div>

    <button className="slider-btn right" onClick={() => scrollSlider(1)}>&gt;</button>
  </div>

  <button className="view-more" onClick={handleViewMore}>View More Hostels</button>
</section>





}
{/* About Section */}
<section className="about-section">
        <h2>About Livanzo</h2>
        <p>
          Livanzo is your trusted companion for finding the best hostels, rooms, and PGs across the country. Whether you’re a student, a working professional, or a family — we bring verified listings, real reviews, and seamless booking to your fingertips.
        </p>
      </section>

      {/* Why Choose Us */}
 <section className="features-section">
  <h2>Why Choose Livanzo?</h2>
  <div className="features-grid">
    <div className="feature-box">
      <h4>Verified Listings</h4>
      <p>Only trusted and owner-uploaded hostels appear on our platform.</p>
    </div>
    <div className="feature-box">
      <h4>Smart Filters</h4>
      <p>Quickly filter by rent, city, room type, and amenities.</p>
    </div>
    <div className="feature-box">
      <h4>Map View Support</h4>
      <p>Open the exact location in Google Maps directly from listings.</p>
    </div>
    <div className="feature-box">
      <h4>User Ratings</h4>
      <p>See real ratings from people who’ve stayed before you.</p>
    </div>
    <div className="feature-box">
      <h4>Image Gallery</h4>
      <p>Browse multiple images to visualize your next stay before booking.</p>
    </div>
    <div className="feature-box">
      <h4>Owner Dashboard</h4>
      <p>Owners can add, edit, and manage hostel listings easily.</p>
    </div>
    <div className="feature-box">
      <h4>Mobile Friendly</h4>
      <p>Use Livanzo seamlessly from your mobile phone or tablet.</p>
    </div>
    <div className="feature-box">
      <h4>Instant Contact</h4>
      <p>Quick contact options to connect with hostel owners directly.</p>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <h3>Livanzo</h3>
          <p>Made with ❤️ by Shivansh Singh Rathore</p>
        </div>
        <div className="footer-right">
          <a href="mailto:livanzo.support@gmail.com">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;

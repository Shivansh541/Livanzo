import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/home.css";
import { useTheme } from "../../context/ThemeContext";
import { ReactTyped } from 'react-typed'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleMap, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import { useMap } from "../../context/MapProvider"; // adjust path
import { faSearch,  faShieldAlt,
  faFilter,
  faMapMarkedAlt,
  faStar,
  faImages,
  faUserCog,
  faMobileAlt,
  faPhoneAlt,
  faLocationCrosshairs, } from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css";
const containerStyle = {
  width: "80%",
  height: "80vh",
};

const Home = ({ hostels }) => {
    const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const { theme } = useTheme()
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [sliderHostels, setSliderHostels] = useState([]);
  const [role, setRole] = useState(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in km
};
  const handleRecenter = () => {
    if (userLocation && map) {
      map.panTo(userLocation);
      map.setZoom(14);
    }
  };
    useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          acc: position.coords.accuracy
        };
        setUserLocation(coords);
      },
      () => {
        // fallback to Lucknow if permission denied
        setUserLocation({ lat: 26.8467, lng: 80.9462 });
      }
    );

  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
    // Show only top 6-8 hostels (latest or highest rated)
    const sorted = [...hostels].sort((a, b) => b.rating - a.rating).slice(0, 6);
    setSliderHostels(sorted);
  }, [hostels]);
  useEffect(()=>{
    AOS.init({
    duration: 500, // animation duration in ms
    once: false,     // only animate once
    offset: 120, 
    })
      setTimeout(() => {
    AOS.refresh();
  }, 500); // refresh after React renders dynamic content
  },[])
  useEffect(() => {
  AOS.refresh(); // re-scan DOM when data changes
}, [hostels]);
const features = [
  [faShieldAlt, "Verified Listings", "Only trusted and owner-uploaded hostels appear on our platform."],
  [faFilter, "Smart Filters", "Quickly filter by rent, city, room type, and amenities."],
  [faMapMarkedAlt, "Map View Support", "Open the exact location in Google Maps directly from listings."],
  [faStar, "User Ratings", "See real ratings from people who’ve stayed before you."],
  [faImages, "Image Gallery", "Browse multiple images to visualize your next stay before booking."],
  [faUserCog, "Owner Dashboard", "Owners can add, edit, and manage hostel listings easily."],
  [faMobileAlt, "Mobile Friendly", "Use Livanzo seamlessly from your mobile phone or tablet."],
  [faPhoneAlt, "Instant Contact", "Quick contact options to connect with hostel owners directly."]
];

  const sliderRef = useRef();

  const scrollSlider = (direction) => {
    const scrollAmount = 300; // Card width + margin
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleViewMore = () => {
    const role = localStorage.getItem("role");
    if (role === "owner") {
      navigate(`/owner/allhostels`);
    } else if (role === "renter") {
      navigate(`/user/allhostels`);
    } else {
      navigate("/allhostels");
    }
  };
  const handleClick = (id) => {
    const role = localStorage.getItem("role");
    if (role === "owner") {
      navigate(`/owner/hostel/${id}`);
    } else if (role === "renter") {
      navigate(`/user/hostel/${id}`);
    } else {
      navigate("/login");
    }
  };
const { isLoaded } = useMap();

  if (!isLoaded || !userLocation) return <div>Loading map...</div>;
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div data-aos = "fade-right" className="hero-left">
          <h1><ReactTyped
            strings={[`Find Your Perfect Stay with <span class = 'brand'>Livanzo</span>`]}
            typeSpeed={50}
            backSpeed={0}
            smartBackspace={false}
            loop
            showCursor={false}
            backDelay={1000}
          />
          </h1>

          <p className="hero-description">Discover verified hostels and PGs tailored for students and professionals. Search easily, view real photos, and read trusted reviews.</p>
          <div className="hero-buttons">
            <button style={{ display: 'flex', gap: '10px' }} onClick={handleViewMore}><FontAwesomeIcon icon={faSearch} />Browse Hostels</button>
            {!role && (
              <button className="secondary-btn" onClick={() => navigate("/signup")}>
                List Your Property
              </button>
            )}
          </div>
          <div className="hero-search-bar">
            <input type="search" placeholder="Search by city, college, or area..." />
            <button>
              🔍
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img src={`/assets/images/illustration ${theme}.png`} alt="Hostel illustration" />
        </div>
      </section>


      {/* Hostel Slider */}
      {sliderHostels?.length > 0 && (
        <section className="slider-section">
          <h2>Top Rated Hostels</h2>

          <div className="slider-container">
            <button
              className="slider-btn left"
              onClick={() => scrollSlider(-1)}
            >
              &lt;
            </button>

            <div className="slider-track" ref={sliderRef}>
              {hostels.slice(0, 8).map((h,i) => (
                <div
                  key={h._id}
                  className="slider-card"
                  onClick={() => handleClick(h._id)}
                  data-aos = "zoom-in"
                  data-aos-delay = {i*100}
                >
                  <img
                    src={
                      h.images?.[0]
                        ? h.images[0].startsWith("http")
                          ? h.images[0]
                          : `${BACKEND_URL}${h.images[0]}`
                        : "https://via.placeholder.com/250x150?text=No+Image"
                    }
                    alt="hostel"
                  />
                  <h3>{h.name}</h3>
                  <p>{h.city || h.address?.city}</p>
                  <span>₹{h.rent}/mo</span>
                </div>
              ))}
            </div>

            <button
              className="slider-btn right"
              onClick={() => scrollSlider(1)}
            >
              &gt;
            </button>
          </div>

          <button className="view-more" onClick={handleViewMore}>
            View More Hostels
          </button>
        </section>
      )}
      <section className="home-map">
        <h2>Where we are</h2>
              <GoogleMap

        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={15}
        onLoad={(mapInstance) => setMap(mapInstance)}
          options={{
    streetViewControl: false,
    fullscreenControl: false,
        mapTypeControlOptions: {
      style: window.google?.maps.MapTypeControlStyle?.DROPDOWN_MENU,
    },
  }}
      >
      <Marker
      position={userLocation}
      icon={{
        path: window.google?.maps.SymbolPath?.CIRCLE,
        scale: 8,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "white",
      }}
    />
    
    {/* Accuracy Circle */}
    <Circle
      center={userLocation}
      radius={userLocation.acc} // Approximate accuracy in meters (adjustable)
      options={{
        strokeColor: "#4285F4",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#4285F4",
        fillOpacity: 0.1,
      }}
    />
{hostels.map((hostel, index) => (
  <Marker
    key={index}
    position={hostel.latLng}
    icon={
      window.google?.maps
        ? {
            url: "/assets/images/location.png",
            scaledSize: new window.google.maps.Size(50, 50),
          }
        : undefined
    }
    onClick={() => setSelectedHostel(hostel)}
  />
))}


        {selectedHostel && (
          <InfoWindow
            position={{
              lat: selectedHostel.latLng.lat,
              lng: selectedHostel.latLng.lng,
            }}
            onCloseClick={() => setSelectedHostel(null)}
          >
            <div>
              <strong>{selectedHostel.name}</strong>
              <br />
                {userLocation && (
    <span>
      Distance:{" "}
      {calculateDistance(
        userLocation.lat,
        userLocation.lng,
        selectedHostel.latLng.lat,
        selectedHostel.latLng.lng
      ).toFixed(2)}{" "}
      km
    </span>
  )}
  <br />
              <button
              className="viewDetails"
                onClick={()=>handleClick(selectedHostel._id)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Details
              </button>
              <a
              className="home-map-link"
  href={selectedHostel.mapsUrl}
  target="_blank"
  rel="noopener noreferrer"
>
  Open in Maps
</a>

            </div>
          </InfoWindow>
        )}
<FontAwesomeIcon className='getCurrLoc' onClick={handleRecenter} icon = {faLocationCrosshairs}/>
      </GoogleMap>
      </section>
      {/* About Section */}

    <section className="about-section">
      <h2 className="about-title">About Livanzo</h2>

      <div className="about-top" data-aos="fade-up">
        <p className="about-intro">
          Livanzo is your trusted companion for discovering the best hostels, PGs, and rental homes
          across India. Designed for students, working professionals, and families, we offer a platform
          that ensures safety, convenience, and transparency in accommodation search.
        </p>
        <img
          src="/assets/images/about-illustration.png"
          alt="About Livanzo"
          className="about-image"
        />
      </div>

<div className="about-grid">
  <div data-aos="fade-up" className="about-card">
    <img src="/assets/images/what-we-do.png" alt="What We Do" className="card-icon" />
    <h3>What We Do</h3>
    <p>We connect property owners with renters through a reliable platform featuring verified listings, reviews, and modern tools.</p>
  </div>

  <div data-aos="fade-up" className="about-card">
    <img src="/assets/images/mission.png" alt="Our Mission" className="card-icon" />
    <h3>Our Mission</h3>
    <p>To simplify accommodation discovery by making it fast, transparent, and accessible across every city and town.</p>
  </div>

  <div data-aos="fade-up" className="about-card">
    <img src="/assets/images/vision.png" alt="Our Vision" className="card-icon" />
    <h3>Our Vision</h3>
    <p>To become India’s most trusted rental and hostel discovery platform — focused on quality and user empowerment.</p>
  </div>
    <div data-aos="fade-up" className="about-card">
      <img src="/assets/images/values.png" alt="Core values" className="card-icon" />
      <h3>Core Values</h3>
      <p>Our approach is rooted in trust, accessibility, innovation, and transparency — to ensure every user feels at home.</p>
    </div>
</div>


      <div className="about-quote" data-aos="zoom-in">
        <blockquote>
          “A good stay begins with a great search — we make sure you never have to compromise.”
        </blockquote>
      </div>
    </section>
      {/* Why Choose Us */}
      <section className="features-section">
        <h2>Why Choose Livanzo?</h2>
        <div className="features-grid">
          {features.map((feature,index)=>(
            <div key={index} data-aos = "fade-up" data-aos-delay ={(index%3)*100} className="feature-box">
              <FontAwesomeIcon icon = {feature[0]} className="feature-icon"/>
              <h4>{feature[1]}</h4>
              <p>{feature[2]}</p>
            </div>
          ))}
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

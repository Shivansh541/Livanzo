import React, { useState, useRef, useEffect } from 'react';
import './css/manageHostel.css';
import {
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { useMap } from "../../context/MapProvider"; // adjust path

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};
const ManageHostel = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const mapRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    rent: '',
    description: '',
    roomType: 'Single',
    allowedFor: 'Both',
    images: [], // will hold FileList
    landmark: '',
    address: '',
    mapsUrl: '',
    nearbyColleges: '',
    facilities: '',
  });
  const apikey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  // Get current location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      () => {
        console.warn("Geolocation permission denied.");
      }
    );
  }, []);
  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLocation({ lat, lng });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apikey}`
    );
    const data = await response.json();
    const formatted = data.results[0]?.formatted_address;
    if (formatted) {
      const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`
      setForm({ ...form, address: formatted, mapsUrl });
    }
  };

  const handlePlaceSelect = async(place) => {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setLocation({ lat, lng });
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`
      const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apikey}`
  );
  const data = await response.json();
  const address = data.results[0]?.formatted_address || place.formatted_address || "";
    setForm({ ...form, address, mapsUrl });
  };
  const initAutocomplete = () => {
    const input = document.getElementById("autocomplete");
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    console.log(input)
    autocomplete.setFields(["formatted_address", "geometry"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      handlePlaceSelect(place);
    });
  };
  const handleRecenter = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCenter = { lat: latitude, lng: longitude };
        setLocation(newCenter);
        if (mapRef.current) {
          mapRef.current.panTo(newCenter);
        }
      },
      () => alert("Unable to fetch location")
    );
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLocation({ lat, lng });

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apikey}`
      );
      const data = await response.json();
      const result = data.results[0];
      if (result) {
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`
        setForm({ ...form, address: result.formatted_address, mapsUrl });
      } else {
        alert("Could not fetch address for your location.");
      }
    });
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      setForm({ ...form, images: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Basic fields
    formData.append('name', form.name);
    formData.append('rent', form.rent);
    formData.append('description', form.description);
    formData.append('roomType', form.roomType);
    formData.append('allowedFor', form.allowedFor);
    formData.append('address', form.landmark + ', ' + form.address)
    formData.append('mapsUrl', form.mapsUrl);

    // Arrays (split by commas)
    form.nearbyColleges
      .split(',')
      .map((college) => college.trim())
      .forEach((college) => formData.append('nearbyColleges', college));

    form.facilities
      .split(',')
      .map((f) => f.trim())
      .forEach((f) => formData.append('facilities', f));

    // Images
    for (let i = 0; i < form.images.length; i++) {
      formData.append('images', form.images[i]);
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/hostel/add`, {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('token'),
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('Hostel added successfully!');
        window.location.reload(); // optional: reload or redirect
      } else {
        alert(data.error || 'Failed to add hostel');
      }
    } catch (error) {
      console.error(error.message);
      alert('Something went wrong!');
    }
  };
  const {isLoaded} = useMap()
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="manage-hostel-container">
      <h2>Add New Hostel</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <input name="name" placeholder=" " value={form.name} onChange={handleChange} required />
          <label>Hostel Name <span className="required">*</span></label>
        </div>

        <div className="form-group">
          <input type="number" name="rent" placeholder=" " value={form.rent} onChange={handleChange} required />
          <label>Rent <span className="required">*</span></label>
        </div>

        <div className="form-group full-width">
          <textarea name="description" placeholder=" " value={form.description} onChange={handleChange}></textarea>
          <label>Description</label>
        </div>

        <div className="form-group">
          <label htmlFor="images">Upload Images <span className="required">*</span></label>
          <input type="file" name="images" id="images" multiple accept="image/*" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <input name="landmark" placeholder=" " value={form.landmark} onChange={handleChange} />
          <label>Landmark</label>
        </div>

          {/* <button onClick={handleUseCurrentLocation}>Your Location</button> */}
        <div className="form-group full-width">
          <input name="address" placeholder=" " value={form.address} onChange={handleChange} readOnly />
          <label>Address</label>
        </div>
        <div >
        </div>
          <div className = "inputMap full-width">
        <input
          id="autocomplete"
          type="text"
          placeholder="Search address..."

          onFocus={initAutocomplete}
        />
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location.lat ? location : { lat: 28.6139, lng: 77.209 }}
              zoom={location.lat ? 15 : 5}
              onClick={handleMapClick}
              options={{
                    mapTypeControl: true,
    mapTypeControlOptions: {
      style: window.google?.maps.MapTypeControlStyle?.DROPDOWN_MENU,
    },
                streetViewControl: false,
                fullscreenControl: false,
              }}
              onLoad={(map) => (mapRef.current = map)}
            >
              {location.lat && <Marker position={location} />}
            </GoogleMap>
            <FontAwesomeIcon className='getCurrLoc' onClick={()=>{handleRecenter();handleUseCurrentLocation()}} icon = {faLocationCrosshairs}/>
          </div>
        <div className="form-group">
          <input name="nearbyColleges" placeholder=" " value={form.nearbyColleges} onChange={handleChange} />
          <label>Nearby Colleges (comma separated)</label>
        </div>

        <div className="form-group">
          <input name="facilities" placeholder=" " value={form.facilities} onChange={handleChange} />
          <label>Facilities (comma separated)</label>
        </div>

        <div className="form-group">
          <label htmlFor="roomType">Room Type</label>
          <select name="roomType" id="roomType" value={form.roomType} onChange={handleChange} required>
            <option>Single</option>
            <option>Double</option>
            <option>Triple</option>
            <option>Dormitory</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="allowedFor">Allowed For</label>
          <select name="allowedFor" id="allowedFor" value={form.allowedFor} onChange={handleChange} required>
            <option>Boys</option>
            <option>Girls</option>
            <option>Both</option>
            <option>Family</option>
          </select>
        </div>

        <button type="submit">Add Hostel</button>
      </form>

    </div>

  );
};

export default ManageHostel;

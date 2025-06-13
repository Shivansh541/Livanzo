// LocationPicker.js
import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete
} from '@react-google-maps/api';

const centerOfIndia = { lat: 20.5937, lng: 78.9629 };

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDtIZJa4KOKLbwJNAi0cInGdnuhLyP2kP0',
    libraries: ['places'],
  });

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = { lat: latitude, lng: longitude };
        setPosition(coords);
        onLocationSelect(coords);
      },
      () => setPosition(centerOfIndia)
    );
  }, []);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setPosition(coords);
      onLocationSelect(coords);
    }
  };

  const handleMapClick = (e) => {
    const coords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setPosition(coords);
    onLocationSelect(coords);
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div style={{ marginTop: '20px' }}>
      <label>📍 Location:</label>
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Enter address"
          style={{ width: '100%', padding: '8px' }}
        />
      </Autocomplete>

      <div style={{ height: '300px', width: '100%', marginTop: '10px' }}>
        <GoogleMap
          center={position || centerOfIndia}
          zoom={14}
          mapContainerStyle={{ height: '100%', width: '100%' }}
          onClick={handleMapClick}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {position && <Marker position={position} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default LocationPicker;

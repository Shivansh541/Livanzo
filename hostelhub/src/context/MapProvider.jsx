import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  return (
    <MapContext.Provider value={{ isLoaded }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);

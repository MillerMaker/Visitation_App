import { useState, useEffect } from "react";

export function useGeolocation(updateInterval = 5000) {
  const [position, setPosition] = useState([0, 0]);

  useEffect(() => {    
    const getLocation = () => {
      if(!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          alert("Hey, there was a geolocation error!" + err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    };
    
    getLocation(); // Initial call
    const interval = setInterval(getLocation, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  return { position };
}
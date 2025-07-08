// hooks/useNearbyLocations.js
import { useState, useRef, useCallback } from "react";
import { getNearbyLocations } from "../services/locationServices";


// hooks/useNearbyLocations.js
export function useNearbyLocations() {
  const [locationData, setLocationData] = useState([]);
  const hasFetchedLocations = useRef(false);

  const fetchLocations = useCallback(async (latitude, longitude, radius, forceRefetch = false) => {
    if (!hasFetchedLocations.current || forceRefetch) {
      const data = await getNearbyLocations(latitude, longitude, radius);
      setLocationData(data);
      hasFetchedLocations.current = true;
    }
  }, []);

  const resetFetchState = useCallback(() => {
    hasFetchedLocations.current = false;
  }, []);

  return { locationData, fetchLocations, resetFetchState };
}
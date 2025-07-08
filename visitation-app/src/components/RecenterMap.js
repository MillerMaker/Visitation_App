import { useMap } from "react-leaflet";
import { useEffect } from "react";

const RecenterMap = ({ position, trigger }) => {
  const map = useMap();

  useEffect(() => {
    console.log("Recentering");
    if (map && position && position[0] !== 0 && position[1] !== 0) {
      map.setView(position, 50);
    }
  }, [map, trigger]);

  return null;
};

export default RecenterMap;
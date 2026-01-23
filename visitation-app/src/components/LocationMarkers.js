// components/LocationMarkers.jsx
import React, {useEffect} from "react";
import { Marker, Popup, useMap} from "react-leaflet";
import L from "leaflet";
import locationOutline from "../assets/locationOutline.png";
import locationFilled from "../assets/locationFilled.png";

const LocationMarkers = ({ locations = [], onSelectLocation }) => {
  const map = useMap();

  if (locations == null) {
    return <></>
  }

  const locationOutlineIcon = L.icon({
    iconUrl: locationOutline,
    iconSize: [60, 70],
    iconAnchor: [30, 51],
    popupAnchor: [1, -34],
  });

  const locationFilledIcon = L.icon({
    iconUrl: locationFilled,
    iconSize: [60, 70],
    iconAnchor: [30, 51],
    popupAnchor: [1, -34],
  });
  
  const handleMarkerClick = (location) => {
    onSelectLocation(location);
    map.flyTo([location.latitude, location.longitude], 18, { animate: true });
  };

  return (
    <>
      {locations.map((location, index) => ( 
        <Marker 
          key={index}
          position={[location.latitude, location.longitude]} 
          icon={!location.visited ? locationOutlineIcon : locationFilledIcon}
          eventHandlers={{
            click: () => {handleMarkerClick(location);},
          }}
        >
        </Marker>
      ))}
    </>
  );
};

export default LocationMarkers;
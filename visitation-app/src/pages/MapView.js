import React , {useState, useEffect, useRef} from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import { useNearbyLocations } from "../hooks/useNearbyLocations";
import RecenterMap from "../components/RecenterMap";
import LocationPanel from "../components/LocationPanel";
import UserMarker from "../components/UserMarker";
import LocationMarkers from "../components/LocationMarkers";
import RecenterMapIcon from "../components/RecenterMapIcon";
import "leaflet/dist/leaflet.css";
import "../components/LocationInfo.css";

// FYI, start the app and backend using `npm run dev` and then open the console to see the logs.
// To build and deploy the app, use `npm run build` and then deploy the `build` folder to your server.


// This is a simple map view component that uses React Leaflet to display a map with user and location markers.

const MapView = () => {
  // Custom hooks
  const { position } = useGeolocation(5000); // Update every 5 seconds
  const { locationData, fetchLocations } = useNearbyLocations();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  

  // Effects
  React.useEffect(() => {
    if (position[0] !== 0 && position[1] !== 0) {
      fetchLocations(position[0], position[1], 500); 
    }
  }, [position, fetchLocations]);

  const onVisitCreated = async () => {
    setSelectedLocation(null);
    // Force a refetch when modal closes
    if (position[0] !== 0 && position[1] !== 0) {
      await fetchLocations(position[0], position[1], 500, true); // Pass true to force refetch
    }
  }

  // Add this event handler
  const handleMapClick = () => {
    setSelectedLocation(null);
  };

  const MapEventHandler = ({ onMapClick, onMapMove }) => {
    const map = useMap();

    useEffect(() => {
      if (map) {
        map.on('click', onMapClick);
        map.on('dragend', onMapMove);

        return () => {
          map.off('click', onMapClick);
          map.off('dragend', onMapMove);
        };
      }
    }, [map, onMapClick, onMapMove]);

    return null;
  };

  const handleMapMove = () => {
    setSelectedLocation(null);
  };
  
  return (
  <div style={{ position: "relative", justifyContent: "center", alignItems: "center" }}>
    {(position[0] !== 0 && position[1] !== 0) ? (
        <MapContainer
          center={[position[0], position[1]]}
          zoom={20}
          style={{ height: "calc(100vh - 70px)", width: "100%" }}
        >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; OpenStreetMap contributors' 
        />
        <UserMarker
          position={position} 
        />
        <LocationMarkers 
          locations={locationData} 
          onSelectLocation={setSelectedLocation} 
        />
        <MapEventHandler 
          onMapClick={handleMapClick} 
          onMapMove={handleMapMove}  
        />
        <RecenterMap 
          position={position} 
          trigger={recenterTrigger} 
        />
      </MapContainer>
    ) : (
      <div>Finding your location...</div>
    )}
    <LocationPanel
      className="location-info-panel"
      selectedLocation={selectedLocation}
      onVisitCreated={onVisitCreated}
      onRecenter = {() => { 
        setRecenterTrigger(t => t + 1);
        setSelectedLocation(null);
      }}
    />
  </div>
  );
};

export default MapView;
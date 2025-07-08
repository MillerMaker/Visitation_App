import React , { useState } from "react";
import NewVisitModal from "./NewVisitModal";
import LocationInfo from "./LocationInfo";
import "./LocationPanel.css";
import RecenterMapIcon from "./RecenterMapIcon";

const LocationPanel = ({ selectedLocation, onVisitCreated, onRecenter }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleModalClose = () => {
        onVisitCreated();
        setModalVisible(false);
    }
      
  return (
    <>
      {selectedLocation && modalVisible && (
        <div className="modal-overlay">
          <NewVisitModal
            location={selectedLocation}
            onClose={handleModalClose}
          />
        </div>
      )}
      <div className = "location-panel-parent">
        <RecenterMapIcon className="recenter-map-icon" onClick={onRecenter}/>
          {selectedLocation && (
          <div className = "location-panel">
            <LocationInfo location={selectedLocation}/>

              <button
                className="new-visit-button"
                onClick={() => {setModalVisible(true);}}
              >
                New Visit
              </button>
          </div>
          )
        }
      </div>
    </>
  );
};

export default LocationPanel;
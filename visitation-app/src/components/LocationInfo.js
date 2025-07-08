import React, { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquareXIcon } from "lucide-react";
import { getVisitsAtLocation } from "../services/visitServices";
import "./LocationInfo.css";

const LocationInfo = ({ location }) => {
  const [visitList, setVisitList] = useState([]);

  useEffect(() => {
    if (location) {
      getVisitsAtLocation(location.id).then((data) => {
        setVisitList(data || []);
        console.log("Visit List: ", data);
      });
    }
  }, [location]);

  return !location ? (
    <div></div>
  ) : (
    <div className="location-info-panel">
      <h2>{`${location.number} ${location.street}`}</h2>
      {visitList.length > 0 && (
        <>
          <h4>Past Visits</h4>
          <div className="visit-list">
            {visitList.map((element, index) => (
              <div className="visit-entry" key={index}>
                <h4>
                  {element.firstName} {element.lastName} {new Date(element.visitDate).toLocaleDateString()}
                  {element.visitOutcome === "Receptive" && <ThumbsUp size={16} />}
                  {element.visitOutcome === "Not Interested" && <ThumbsDown size={16} />}
                  {element.visitOutcome === "No Answer" && <MessageSquareXIcon size={16} />}
                </h4>
                <p>{element.notes}</p>
              </div>
            ))}
          </div>
        </>
      )}
      
    </div>
  );
};

export default LocationInfo;
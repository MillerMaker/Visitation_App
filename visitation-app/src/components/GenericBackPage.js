
import { useState } from "react";
import { newVisit } from "../services/visitServices";
import { ChevronLeft, Route } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./GenericBackPage.css"; // Import the external CSS file

const GenericBackPage = ({ children , title , onBack}) => {
    const navigate = useNavigate();

  return (

      <div className="main-container">
        <div className="main-header">
          <button onClick={onBack} className="close-button">
              <ChevronLeft size={40} />
          </button>
          <h3 className="main-title"> {title} </h3>  
        </div>
        <div className="main-content">
          {children}
        </div>
      </div>

  );
};

export default GenericBackPage;
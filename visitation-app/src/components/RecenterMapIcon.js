import React from "react";
import { Navigation } from "lucide-react";
import "./RecenterMapIcon.css";

const RecenterMapIcon = ({ onClick }) => {
    return (
        <button className="recenter-map-btn" onClick={onClick}>
            <Navigation />
        </button>
    );
};

export default RecenterMapIcon;
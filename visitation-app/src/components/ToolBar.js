import React from 'react'; 
import { House, MapPin, Menu } from 'lucide-react';
import ToolBarButton from './ToolbarButton';
import './ToolBar.css'; // Assuming you have a CSS file for styling

const ToolBar = () => {

    return (
        <div>
            <div className="tool-bar-container ">
                <ToolBarButton to = "/" label = "Home" Icon = {House} ></ToolBarButton>
                <ToolBarButton to = "/map" label = "Map" Icon = {MapPin} ></ToolBarButton>
                <ToolBarButton to = "/settings" label = "Settings" Icon = {Menu} ></ToolBarButton>
            </div>
        </div>
    );
};

export default ToolBar;
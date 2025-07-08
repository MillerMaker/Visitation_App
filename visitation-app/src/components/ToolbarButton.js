import React from 'react';
import { NavLink } from 'react-router-dom'; 
import './ToolBarButton.css';

// ToolbarButton component
const ToolBarButton = ({ to, label, Icon }) => {
    return (
      <NavLink to={to} className="toolbar-button">
        {({ isActive }) => (
          <>
            <Icon size={40} color={isActive ? '#6CB276' : '#000'} />
            {label}
          </>
        )}
      </NavLink>
    );
  };

export default ToolBarButton;
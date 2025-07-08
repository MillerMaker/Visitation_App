import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, LogOut, Mail, Church } from 'lucide-react'; 
import { useAuth } from '../providers/AuthProvider';
import './HomePageTools.css';

function HomePageTools() {
  const navigate = useNavigate();
  const {logout}  = useAuth();
 

  return (
    <div className="tools-card">
      <div className="tools-list">
        <div className="tool" onClick = {() => {navigate("/map")}}>
          <MapPin></MapPin>
          <div className="tool-name">All Visits</div> 
        </div>
        <div className="tool" onClick = {() => {navigate("/users")}}>
          <Mail></Mail>
          <div className="tool-name">Invite New Users</div> 
        </div>
        <div className="tool" onClick = {() => {navigate("/users")}}>
          <div className = 'tool-icon'><Church></Church></div>
          <div className="tool-name">Edit Organization</div> 
        </div>
        <div className="tool" onClick = {() => {logout()}}>
          <LogOut></LogOut>
        <div className="tool-name">Log Out</div> 
        </div>
      </div>
    </div>
  );
}

export default HomePageTools;
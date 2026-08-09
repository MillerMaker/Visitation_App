import React, { useEffect, useState } from 'react';
import './ChurchSummaryCard.css';
import logo from '../assets/concord-logo.png'; // Replace with your local image import

function ChurchSummaryCard() {
  const [data, setData] = useState({ activeUsers: 0, totalVisits: 0, timeElapsed: '0:00' });

  useEffect(() => {
    async function fetchData() {
      //const result = await getMostRecentOutreachData();
      setData({
        activeUsers: /*result.activeUsers */ 13,
        totalVisits: /* result.totalVisits */ 100,
        timeElapsed: /* result.timeElapsed */ 10
        // activeUsers: 13,
        // totalVisits: 100,
        // timeElapsed: 10
      });
    }

    fetchData();
  }, []);

  return (
    <div className="concord-card">
      <div className="header">
        <img src={logo} alt="Concord Logo" className="logo" />
        <div className="title-section">
          <h2>Concord Baptist Church</h2>
          <span className="subtitle">Last Outreach:</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="stat-value">{data.activeUsers}</div>
          <div className="stat-label">members</div>
        </div>
        <div className="stat">
          <div className="stat-value">{data.totalVisits}</div>
          <div className="stat-label">total visits</div>
        </div>
      </div>
    </div>
  );
}

export default ChurchSummaryCard;
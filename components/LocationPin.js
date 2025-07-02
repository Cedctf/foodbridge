import React, { useState } from 'react';

const LocationPin = ({ food, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get color based on expiry status
  const getExpiryColor = (expiryDate) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    if (daysLeft < 0) return '#FF0000'; // Expired - red
    if (daysLeft === 0) return '#FF8C00'; // Expires today - orange
    if (daysLeft <= 3) return '#FFD700'; // Soon - yellow
    return '#4CAF50'; // Good - green
  };

  // Generate SVG for the pin
  const generatePinSVG = () => {
    const pinColor = getExpiryColor(food.expiryDate);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <path d="M16 2C10.48 2 6 6.48 6 12c0 8.25 10 18 10 18s10-9.75 10-18c0-5.52-4.48-10-10-10z" fill="${pinColor}"/>
        <circle cx="16" cy="12" r="4" fill="white"/>
      </svg>
    `;
  };

  // Format expiry date for display
  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get expiry status text
  const getExpiryText = (expiryDate) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Expires today';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ position: 'relative', cursor: 'pointer' }}
    >
      {/* Pin Icon */}
      <div dangerouslySetInnerHTML={{ __html: generatePinSVG() }} />
      
      {/* Hover Info Card */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          padding: '12px',
          width: '200px',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
            {food.name}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '4px',
            fontSize: '12px',
            color: getExpiryColor(food.expiryDate)
          }}>
            <span style={{ marginRight: '4px' }}>⏱</span>
            <span>{getExpiryText(food.expiryDate)} ({formatExpiryDate(food.expiryDate)})</span>
          </div>
          
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            {food.foodType} • Qty: {food.quantity}
          </div>
          
          <button style={{
            width: '100%',
            padding: '6px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            Show Details
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationPin;
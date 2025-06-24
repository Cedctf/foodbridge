'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
};

const LocationButton = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'white',
      border: 'none',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      zIndex: 1000,
      // Fix for square background issue
      outline: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
      // Ensure circular shape is maintained
      minWidth: '40px',
      minHeight: '40px',
      maxWidth: '40px',
      maxHeight: '40px',
      // Override any inherited styles
      margin: 0,
      padding: 0,
      lineHeight: 1,
      fontSize: 0
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = '#f5f5f5';
      e.target.style.transform = 'scale(1.05)';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = 'white';
      e.target.style.transform = 'scale(1)';
    }}
    aria-label="Get current location"
    title="Get current location"
  >
    {loading ? (
      <div style={{
        width: '20px',
        height: '20px',
        border: '2px solid #4285F4',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
          fill="#4285F4"
        />
      </svg>
    )}
  </button>
);

const ErrorToast = ({ message, onClose }) => (
  <div style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 10000,
    animation: 'slideIn 0.3s ease-out',
    maxWidth: '300px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '0',
          marginLeft: '8px'
        }}
      >
        ×
      </button>
    </div>
  </div>
);

const MapWithLocationButton = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 3.1390, lng: 101.6869 });
  const [mapZoom, setMapZoom] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const watchId = useRef(null);

  // Cleanup geolocation watch on unmount
  useEffect(() => {
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  // Auto-detect location on mount (removed for better UX)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getCurrentLocation();
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    // Clear any existing watch
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
    }

    // Enhanced options for better accuracy
    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout
      maximumAge: 0 // Always get fresh position
    };

    const onSuccess = (position) => {
      const accuracy = position.coords.accuracy;
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      console.log('Location found:', newLocation);
      console.log('Accuracy:', accuracy + 'm');
      console.log('Timestamp:', new Date(position.timestamp));
      
      // Only accept location if accuracy is reasonable (less than 100m)
      if (accuracy > 100) {
        console.warn('Location accuracy is poor:', accuracy + 'm');
        setError(`Location found but accuracy is low (${Math.round(accuracy)}m). Try again for better precision.`);
      }
      
      setUserLocation(newLocation);
      setMapCenter(newLocation);
      setMapZoom(17); // Closer zoom for better view
      
      // Update map if loaded
      if (mapRef.current) {
        mapRef.current.panTo(newLocation);
        mapRef.current.setZoom(17);
      }
      
      setLoading(false);
    };

    const onError = (error) => {
      console.error('Geolocation error:', error);
      
      let errorMessage = 'Unable to get your location. ';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Please allow location access in your browser settings and try again.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information is unavailable. Make sure GPS is enabled.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Location request timed out. Please try again.';
          break;
        default:
          errorMessage += 'An unknown error occurred.';
      }
      
      setError(errorMessage);
      setLoading(false);
    };

    // Try to get high accuracy position first
    navigator.geolocation.getCurrentPosition(onSuccess, (error) => {
      // If high accuracy fails, try with lower accuracy
      console.warn('High accuracy failed, trying with lower accuracy');
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        { ...options, enableHighAccuracy: false, timeout: 10000 }
      );
    }, options);
  }, []);

  const onMapLoad = useCallback((map) => {
    console.log('Map loaded successfully');
    mapRef.current = map;
    
    // If we already have user location, center on it
    if (userLocation) {
      map.setCenter(userLocation);
      map.setZoom(17);
    }
  }, [userLocation]);

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        /* Ensure no button style conflicts */
        .gm-style button {
          background: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          text-transform: none !important;
          appearance: none !important;
        }
      `}</style>

      {error && (
        <ErrorToast 
          message={error} 
          onClose={() => setError(null)}
        />
      )}

      <LoadScript 
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        loadingElement={<div>Loading Maps...</div>}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={mapZoom}
          onLoad={onMapLoad}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            gestureHandling: 'greedy',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          }}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE,
                fillColor: '#4285F4',
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 3,
                scale: 10
              }}
              title="Your current location"
            />
          )}
          
          <LocationButton 
            onClick={getCurrentLocation} 
            loading={loading} 
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapWithLocationButton;
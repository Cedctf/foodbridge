import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import SearchBar from './SearchBar';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
};

// Google Maps libraries to load
const libraries = ['places'];

// Sample food posts data - replace with your actual data source
const sampleFoodPosts = [
  {
    id: 1,
    title: "Delicious Nasi Lemak",
    description: "Traditional Malaysian breakfast with coconut rice, sambal, and fried chicken",
    price: "RM 8.50",
    rating: 4.5,
    image: "/api/placeholder/150/100",
    restaurant: "Warung Pak Ali",
    position: { lat: 3.1390, lng: 101.6869 },
    category: "local",
    available: true
  },
  {
    id: 2,
    title: "Char Kway Teow",
    description: "Stir-fried rice noodles with prawns, Chinese sausage, and bean sprouts",
    price: "RM 12.00",
    rating: 4.8,
    image: "/api/placeholder/150/100",
    restaurant: "Uncle Lim's Stall",
    position: { lat: 3.1420, lng: 101.6890 },
    category: "street-food",
    available: true
  },
  {
    id: 3,
    title: "Roti Canai Set",
    description: "Flaky flatbread served with curry dhal and sambal",
    price: "RM 6.00",
    rating: 4.2,
    image: "/api/placeholder/150/100",
    restaurant: "Mamak Corner",
    position: { lat: 3.1360, lng: 101.6850 },
    category: "indian",
    available: false
  }
];

// Custom food icon component
const FoodIcon = ({ category, available }) => {
  const getIconColor = () => {
    if (!available) return '#999999';
    switch (category) {
      case 'local': return '#FF6B6B';
      case 'street-food': return '#4ECDC4';
      case 'indian': return '#45B7D1';
      case 'chinese': return '#96CEB4';
      case 'western': return '#FFEAA7';
      default: return '#DDA0DD';
    }
  };

  return (
    `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="${getIconColor()}" stroke="white" stroke-width="3"/>
        <path d="M12 16h16v2H12zm2 4h12v2H14zm1 4h10v2H15z" fill="white"/>
        ${!available ? '<line x1="8" y1="8" x2="32" y2="32" stroke="white" stroke-width="3"/>' : ''}
      </svg>
    `)}`
  );
};

// Search bar component
// Remove the entire SearchBar component definition (lines 82-149)
// The SearchBar component should only exist in SearchBar.js

// Food post info window component
const FoodPostInfo = ({ post, onClose }) => (
  <div style={{
    maxWidth: '280px',
    padding: '12px',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px'
    }}>
      <h3 style={{
        margin: 0,
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }}>{post.title}</h3>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          color: '#666',
          padding: '0',
          marginLeft: '8px'
        }}
      >×</button>
    </div>
    
    <div style={{
      fontSize: '12px',
      color: '#666',
      marginBottom: '8px'
    }}>
      📍 {post.restaurant}
    </div>
    
    <div style={{
      fontSize: '14px',
      color: '#555',
      marginBottom: '8px',
      lineHeight: '1.4'
    }}>
      {post.description}
    </div>
    
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    }}>
      <span style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#2E7D32'
      }}>{post.price}</span>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span style={{ color: '#FFD700' }}>⭐</span>
        <span style={{ fontSize: '14px', color: '#555' }}>{post.rating}</span>
      </div>
    </div>
    
    <div style={{
      display: 'flex',
      gap: '8px',
      marginTop: '12px'
    }}>
      <button style={{
        flex: 1,
        padding: '8px 12px',
        backgroundColor: post.available ? '#4CAF50' : '#999',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: post.available ? 'pointer' : 'not-allowed'
      }}>
        {post.available ? 'Order Now' : 'Unavailable'}
      </button>
      
      <button style={{
        padding: '8px 12px',
        backgroundColor: 'transparent',
        color: '#4CAF50',
        border: '1px solid #4CAF50',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer'
      }}>
        View Details
      </button>
    </div>
  </div>
);

// Remove the SearchBar import and usage from within the GoogleMap component
// Keep only the LocationButton embedded within the map

// In the GoogleMap component, remove this line:
// <SearchBar onPlaceSelect={handlePlaceSelect} autocompleteRef={autocompleteRef} />

// And update the LocationButton positioning to be more embedded:
const LocationButton = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute',
      bottom: '200px', // Positioned above zoom controls with proper spacing
      right: '10px',   // Aligned with zoom controls
      width: '40px',   // Match Google Maps control size
      height: '40px',
      borderRadius: '20px', // Google Maps style
      backgroundColor: 'white',
      border: 'none',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      zIndex: 1000,
      outline: 'none'
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
          fill="#4285F4"
        />
      </svg>
    )}
  </button>
);

const MapWithLocationButton = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 3.1390, lng: 101.6869 });
  const [mapZoom, setMapZoom] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    const onSuccess = (position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setUserLocation(newLocation);
      setMapCenter(newLocation);
      setMapZoom(16);
      setLoading(false);
    };

    const onError = (error) => {
      console.error('Geolocation error:', error);
      let errorMessage = 'Unable to retrieve your location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
        default:
          errorMessage = 'An unknown error occurred';
          break;
      }
      
      setError(errorMessage);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    if (userLocation) {
      map.panTo(userLocation);
    }
  }, [userLocation]);

  const handlePlaceSelect = (location, address) => {
    setSearchedLocation({ position: location, address });
    setMapCenter(location);
    setMapZoom(16);
  };

  const getUserLocationIcon = () => {
    if (isGoogleMapsLoaded && window.google && window.google.maps) {
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
        scale: 8
      };
    }
    return {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="3"/>
        </svg>
      `)}`,
      scaledSize: { width: 24, height: 24 }
    };
  };

  const getFoodPostIcon = (post) => {
    if (isGoogleMapsLoaded && window.google && window.google.maps) {
      return {
        url: FoodIcon({ category: post.category, available: post.available }),
        scaledSize: { width: 40, height: 40 }
      };
    }
    return {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="#FF6B6B" stroke="white" stroke-width="3"/>
          <path d="M12 16h16v2H12zm2 4h12v2H14zm1 4h10v2H15z" fill="white"/>
        </svg>
      `)}`,
      scaledSize: { width: 40, height: 40 }
    };
  };

  const ErrorToast = ({ message, onClose }) => (
    <div style={{
      position: 'absolute',
      top: '70px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#f44336',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      zIndex: 1001,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      maxWidth: '300px'
    }}>
      <span style={{ fontSize: '14px' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '0'
        }}
      >×</button>
    </div>
  );

  // Add this to the GoogleMap component return statement:
  return (
    <div style={{ position: 'relative' }}>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
    
    {error && (
      <ErrorToast 
        message={error} 
        onClose={() => setError(null)} 
      />
    )}

    <LoadScript 
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      onLoad={() => setIsGoogleMapsLoaded(true)}
    >
      {/* Search Bar positioned above the map */}
      <div style={{
        paddingTop: "16px",
        paddingBottom: "16px",
        backgroundColor: 'transparent'
      }}>
        <SearchBar 
          onPlaceSelect={handlePlaceSelect}
          autocompleteRef={autocompleteRef}
        />
      </div>
      
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
          gestureHandling: 'greedy'
        }}
      >
        
        {userLocation && (
          <Marker
            position={userLocation}
            icon={getUserLocationIcon()}
            title="Your Location"
          />
        )}
        
        {searchedLocation && (
          <Marker
            position={searchedLocation.position}
            icon={{
              url: `data:image/svg+xml;base64,${btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path d="M16 2C10.48 2 6 6.48 6 12c0 8.25 10 18 10 18s10-9.75 10-18c0-5.52-4.48-10-10-10z" fill="#EA4335"/>
                  <circle cx="16" cy="12" r="4" fill="white"/>
                </svg>
              `)}`,
              scaledSize: { width: 32, height: 32 }
            }}
            title={searchedLocation.address}
          />
        )}
        
        {sampleFoodPosts.map((post) => (
          <Marker
            key={post.id}
            position={post.position}
            icon={getFoodPostIcon(post)}
            title={post.title}
            onClick={() => setSelectedPost(post)}
          />
        ))}
        
        {selectedPost && (
          <InfoWindow
            position={selectedPost.position}
            onCloseClick={() => setSelectedPost(null)}
          >
            <FoodPostInfo 
              post={selectedPost} 
              onClose={() => setSelectedPost(null)}
            />
          </InfoWindow>
        )}
      </GoogleMap>
      
      <LocationButton 
        onClick={getCurrentLocation} 
        loading={loading}
      />
    </LoadScript>
  </div>
);
};

export default MapWithLocationButton;
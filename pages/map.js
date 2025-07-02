import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import SmallFoodCard from '../components/SmallFoodCard';
import LocationPin from '../components/LocationPin';
import SearchBar from '../components/SearchBar';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { geocodeAddress } from '../lib/utils';

// Import the map component with dynamic loading to avoid SSR issues
const GoogleMapComponent = dynamic(
  () => import('../components/GoogleMap'),
  { ssr: false }
);

// Custom Map Component that includes food markers with LocationPin
const FoodMapComponent = ({ foods, activeMapLocation, onLocationChange, geocodedFoods }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [isProgrammaticChange, setIsProgrammaticChange] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchMarker, setSearchMarker] = useState(null);
  const [hoveredFood, setHoveredFood] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const autocompleteRef = useRef(null);
  
  // Calculate days until expiry (copied from LocationPin for consistency)
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
    if (daysLeft < 0) return '#808080'; // Expired - gray
    if (daysLeft === 0) return '#FF8C00'; // Expires today - orange
    if (daysLeft <= 3) return '#FFD700'; // Soon - yellow
    return '#4CAF50'; // Good - green
  };

  // Generate custom marker icon for food
  const generateFoodMarkerIcon = (expiryDate) => {
    const pinColor = getExpiryColor(expiryDate);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <radialGradient id="foodGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:${pinColor};stop-opacity:0.95" />
            <stop offset="100%" style="stop-color:${pinColor === '#808080' ? '#666666' : pinColor};stop-opacity:0.8" />
          </radialGradient>
          <filter id="foodShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.12"/>
          </filter>
        </defs>
        
        <!-- Main minimalist circle -->
        <circle 
          cx="20" cy="20" r="16" 
          fill="url(#foodGradient)" 
          filter="url(#foodShadow)"
          stroke="${pinColor}" 
          stroke-width="1"
          opacity="0.9"
        />
        
        <!-- Minimalist food symbol - simple dot pattern -->
        <circle cx="16" cy="16" r="2" fill="white" opacity="0.9"/>
        <circle cx="24" cy="16" r="2" fill="white" opacity="0.9"/>
        <circle cx="20" cy="22" r="2" fill="white" opacity="0.9"/>
        
        <!-- Subtle inner glow -->
        <circle cx="20" cy="20" r="8" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
      </svg>
    `;
    
    return {
      url: `data:image/svg+xml;base64,${btoa(svg)}`,
      scaledSize: { width: 40, height: 40 },
      anchor: { x: 20, y: 20 } // Center of the circle
    };
  };

  // Generate current location marker icon - blue dot like Google Maps
  const generateCurrentLocationIcon = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#4285F4" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
        <circle cx="12" cy="12" r="1" fill="#4285F4"/>
      </svg>
    `;
    
    return {
      url: `data:image/svg+xml;base64,${btoa(svg)}`,
      scaledSize: { width: 24, height: 24 },
      anchor: { x: 12, y: 12 }
    };
  };

  // Generate search marker icon - using default Google Maps marker with custom color
  const generateSearchMarkerIcon = () => {
    // Use default Google Maps marker for search location
    return null; // null means use default Google Maps marker
  };

  // Get expiry text (copied from LocationPin for consistency)
  const getExpiryText = (expiryDate) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Expires today';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };
  
  // Handle food marker click
  const handleFoodMarkerClick = (food) => {
    // Clear hover state when clicking
    setHoveredFood(null);
    setSelectedFood(food);
  };

  // Handle food marker hover with debouncing
  const handleFoodMarkerMouseEnter = (food) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set hover state immediately
    setHoveredFood(food);
  };

  const handleFoodMarkerMouseLeave = () => {
    // Add a longer delay to allow users to move to the info window
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredFood(null);
    }, 1000); // Increased delay to 1000ms (1 second)
  };

  // Handle info window hover to prevent it from disappearing
  const handleInfoWindowMouseEnter = () => {
    // Clear the timeout when user moves to info window
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleInfoWindowMouseLeave = () => {
    // Add a delay when leaving info window to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredFood(null);
    }, 300);
  };

  // Handle place selection from search
  const handlePlaceSelect = (location, address) => {
    if (onLocationChange) {
      setIsProgrammaticChange(true);
      onLocationChange(location);
      setSearchMarker({ position: location, address });
      setTimeout(() => setIsProgrammaticChange(false), 100);
    }
  };

  // Handle search marker drag
  const handleSearchMarkerDragEnd = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setIsProgrammaticChange(true);
    onLocationChange(newPosition);
    setSearchMarker({ position: newPosition, address: 'Dragged location' });
    setTimeout(() => setIsProgrammaticChange(false), 100);
  };

  // Handle opening Google Maps
  const handleOpenGoogleMaps = (food) => {
    const geocodedCoords = geocodedFoods.get(food._id);
    const foodLat = geocodedCoords?.lat || food.lat || 3.1390;
    const foodLng = geocodedCoords?.lng || food.lng || 101.6869;
    
    // Get user's current/searched location
    const userLat = activeMapLocation.lat;
    const userLng = activeMapLocation.lng;
    
    // Create Google Maps URL with directions from user location to food location
    const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${foodLat},${foodLng}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Get current location function
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    const onSuccess = (position) => {
      const userLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setUserLocation(userLoc);
      setIsProgrammaticChange(true);
      onLocationChange(userLoc);
      setTimeout(() => setIsProgrammaticChange(false), 100);
      setLocationLoading(false);
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
      
      alert(errorMessage);
      setLocationLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  };

  // Handle map load
  const onMapLoad = (map) => {
    setMapRef(map);
    setMapLoaded(true);
  };

  // Handle Google Maps API load
  const onGoogleLoad = () => {
    setGoogleLoaded(true);
  };

  // Handle map center change with debouncing
  const onCenterChanged = () => {
    // Disable center change handling to allow smooth panning
    // The location will be updated only when user explicitly searches or uses location button
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Search Bar and Location Controls - positioned above the map */}
      {googleLoaded && (
        <div style={{
          marginBottom: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            <SearchBar onPlaceSelect={handlePlaceSelect} autocompleteRef={autocompleteRef} />
          </div>
          
          {/* Get Current Location Button - matching original design */}
          <button
            onClick={getCurrentLocation}
            style={{
              padding: '12px 16px',
              backgroundColor: 'white',
              color: '#4285F4',
              border: '1px solid #e0e0e0',
              borderRadius: '30px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'scale(1)';
            }}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #4285F4',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                  fill="#4285F4"
                />
              </svg>
            )}
            {locationLoading ? 'Getting Location...' : 'My Location'}
          </button>
        </div>
      )}

      {/* Map Container */}
      <div style={{ position: 'relative', height: '500px' }}>
        <LoadScript 
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          onLoad={onGoogleLoad}
          libraries={['places']}
        >
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '500px',
              borderRadius: '4px',
              border: '1px solid #e0e0e0',
              overflow: 'hidden',
            }}
            center={activeMapLocation}
            zoom={15}
            onLoad={onMapLoad}
            onCenterChanged={onCenterChanged}
            options={{
              gestureHandling: 'greedy', // Allows smooth panning
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: false
            }}
          >
            {/* Current Location Marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                title="Your current location"
                icon={generateCurrentLocationIcon()}
              />
            )}

            {/* Search Marker (Draggable) */}
            {searchMarker && (
              <Marker
                position={searchMarker.position}
                draggable={true}
                onDragEnd={handleSearchMarkerDragEnd}
                title="Search location (drag to move)"
              />
            )}

            {/* Food Markers */}
            {mapLoaded && foods && foods.length > 0 && foods.map((food) => {
              // Get coordinates from geocoded cache or use food coordinates
              const geocodedCoords = geocodedFoods.get(food._id);
              const foodLat = geocodedCoords?.lat || food.lat || 3.1390;
              const foodLng = geocodedCoords?.lng || food.lng || 101.6869;
              
              return (
                <Marker
                  key={food._id}
                  position={{ lat: foodLat, lng: foodLng }}
                  onClick={() => handleFoodMarkerClick(food)}
                  onMouseOver={() => handleFoodMarkerMouseEnter(food)}
                  onMouseOut={handleFoodMarkerMouseLeave}
                  icon={generateFoodMarkerIcon(food.expiryDate)}
                  title={food.name}
                />
              );
            })}
            
            {/* Hover Info Windows for food - only show if no selected food */}
            {hoveredFood && !selectedFood && (
              <InfoWindow
                position={{ 
                  lat: geocodedFoods.get(hoveredFood._id)?.lat || hoveredFood.lat || 3.1390, 
                  lng: geocodedFoods.get(hoveredFood._id)?.lng || hoveredFood.lng || 101.6869 
                }}
                onCloseClick={() => setHoveredFood(null)}
                onMouseEnter={handleInfoWindowMouseEnter}
                onMouseLeave={handleInfoWindowMouseLeave}
              >
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
                    }}>{hoveredFood.name}</h3>
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '8px'
                  }}>
                    📍 {hoveredFood.locationAddress}
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    color: '#555',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {hoveredFood.description}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#2E7D32'
                    }}>{hoveredFood.foodType} • Qty: {hoveredFood.quantity}</span>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ color: '#FF6B6B' }}>⏱</span>
                      <span style={{ fontSize: '14px', color: '#555' }}>{getExpiryText(hoveredFood.expiryDate)}</span>
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
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      Contact
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
                  
                  <div style={{
                    marginTop: '8px'
                  }}>
                    <button
                      onClick={() => handleOpenGoogleMaps(hoveredFood)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#4285F4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#3367D6';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#4285F4';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      View on Google Maps
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
            
            {/* Click Info Windows for selected food */}
            {selectedFood && (
              <InfoWindow
                position={{ 
                  lat: geocodedFoods.get(selectedFood._id)?.lat || selectedFood.lat || 3.1390, 
                  lng: geocodedFoods.get(selectedFood._id)?.lng || selectedFood.lng || 101.6869 
                }}
                onCloseClick={() => setSelectedFood(null)}
              >
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
                    }}>{selectedFood.name}</h3>
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '8px'
                  }}>
                    📍 {selectedFood.locationAddress}
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    color: '#555',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {selectedFood.description}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#2E7D32'
                    }}>{selectedFood.foodType} • Qty: {selectedFood.quantity}</span>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ color: '#FF6B6B' }}>⏱</span>
                      <span style={{ fontSize: '14px', color: '#555' }}>{getExpiryText(selectedFood.expiryDate)}</span>
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
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      Contact
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
                  
                  <div style={{
                    marginTop: '8px'
                  }}>
                    <button
                      onClick={() => handleOpenGoogleMaps(selectedFood)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#4285F4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#3367D6';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#4285F4';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      View on Google Maps
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default function MapPage() {
  const [sortBy, setSortBy] = useState('distance'); // Default to distance
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [activeMapLocation, setActiveMapLocation] = useState({ lat: 1.3521, lng: 103.8198 }); // Default to Singapore
  const [geocodedFoods, setGeocodedFoods] = useState(new Map()); // Cache for geocoded coordinates

  // Geocode food addresses to get coordinates
  const geocodeFoodAddresses = async (foodItems) => {
    const newGeocodedFoods = new Map(geocodedFoods);
    const foodsToGeocode = [];

    // Check which foods need geocoding
    for (const food of foodItems) {
      if (!food.lat && !food.lng && food.locationAddress && !newGeocodedFoods.has(food._id)) {
        foodsToGeocode.push(food);
      }
    }

    // Geocode addresses that haven't been cached
    for (const food of foodsToGeocode) {
      try {
        const coordinates = await geocodeAddress(food.locationAddress);
        if (coordinates) {
          newGeocodedFoods.set(food._id, coordinates);
        }
      } catch (error) {
        console.error(`Error geocoding address for food ${food._id}:`, error);
      }
    }

    setGeocodedFoods(newGeocodedFoods);
    return newGeocodedFoods;
  };

  // Fetch food data from API
  useEffect(() => {
    fetchFoods();
    getUserLocation();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/foods');
      const result = await response.json();

      if (result.success) {
        // Geocode addresses first, then set foods
        await geocodeFoodAddresses(result.data);
        setFoods(result.data);
      } else {
        setError(result.message || 'Failed to fetch food items');
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      setError('An error occurred while fetching food items');
    } finally {
      setLoading(false);
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(userLoc);
        // Automatically set the active map location to user's current location
        setActiveMapLocation(userLoc);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to retrieve your location');
        // Keep default location if geolocation fails
      }
    );
  };

  // Handle location change from map
  const handleMapLocationChange = (location) => {
    setActiveMapLocation(location);
  };

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Get sorted food items based on active map location
  const getSortedFoods = () => {
    if (!foods.length) return [];
    
    // Add distance property to each food item based on active map location
    const foodsWithDistance = foods.map(food => {
      // Get coordinates from geocoded cache or use default
      const geocodedCoords = geocodedFoods.get(food._id);
      const foodLat = geocodedCoords?.lat || food.lat || 3.1390;
      const foodLng = geocodedCoords?.lng || food.lng || 101.6869;
      
      const distance = activeMapLocation 
        ? calculateDistance(activeMapLocation.lat, activeMapLocation.lng, foodLat, foodLng)
        : null;
      
      return {
        ...food,
        lat: foodLat,
        lng: foodLng,
        distance
      };
    });

    // Sort based on selected option
    return foodsWithDistance.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          // If distance is null, put at the end
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating-high':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-low':
          return (a.rating || 0) - (b.rating || 0);
        default:
          return 0;
      }
    });
  };

  // Format distance for display
  const formatDistance = (distance) => {
    if (distance === null) return 'Unknown distance';
    if (distance < 1) return `${Math.round(distance * 1000)} m away`;
    return `${distance.toFixed(1)} km away`;
  };

  return (
    <div className="min-h-screen" style={{ background: '#F7FCFA' }}>
      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Map</h1>
            <p className="text-gray-600">Discover food donations and restaurants near you</p>
          </div>
          
          {/* Map Container with integrated search */}
          <div style={{ backgroundColor: 'none', position: 'relative' }}>
            <FoodMapComponent 
              foods={getSortedFoods()} 
              activeMapLocation={activeMapLocation}
              onLocationChange={handleMapLocationChange} 
              geocodedFoods={geocodedFoods}
            />
          </div>
          
          {/* Sorting Component */}
          <div className="mt-6">
            <div className="flex items-center">
              <label htmlFor="map-sort" className="block text-sm font-medium text-gray-700 mr-4">
                Sort by:
              </label>
              <select
                id="map-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="distance">Nearest</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name (A-Z)</option>
                <option value="rating-high">Highest rating</option>
                <option value="rating-low">Lowest rating</option>
              </select>
            </div>
          </div>
          
          {/* Food Cards Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Available Food Items
              {activeMapLocation && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (sorted by distance from current map location)
                </span>
              )}
            </h2>
            
            <SmallFoodCard 
              foods={getSortedFoods()} 
              loading={loading} 
              error={error} 
              formatDistance={formatDistance} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
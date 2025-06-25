import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import SmallFoodCard from '../components/SmallFoodCard';

// Import the map component with dynamic loading to avoid SSR issues
const GoogleMapComponent = dynamic(
  () => import('../components/GoogleMap'),
  { ssr: false }
);

export default function MapPage() {
  const [sortBy, setSortBy] = useState('distance'); // Default to distance
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [activeMapLocation, setActiveMapLocation] = useState({ lat: 3.1390, lng: 101.6869 }); // Default to KL

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
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to retrieve your location');
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
      const foodLat = food.lat || 3.1390;
      const foodLng = food.lng || 101.6869;
      
      const distance = activeMapLocation 
        ? calculateDistance(activeMapLocation.lat, activeMapLocation.lng, foodLat, foodLng)
        : null;
      
      return {
        ...food,
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
    return `${distance.toFixed(1)} miles away`;
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
          <div style={{ backgroundColor: 'none' }}>
            <GoogleMapComponent 
              sortBy={sortBy} 
              onLocationChange={handleMapLocationChange} 
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
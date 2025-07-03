import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { useUser } from '../contexts/UserContext'

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function RequestPage() {
  const router = useRouter();
  const { foodId } = router.query;
  const { user, isAuthenticated } = useUser();
  const [showChatbot, setShowChatbot] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 3.0648, lng: 101.6031 });
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState({
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    message: ''
  });

  useEffect(() => {
    console.log('Router is ready:', router.isReady);
    console.log('foodId from query:', foodId);
    if (router.isReady && foodId) {
      fetchFoodData();
    }
  }, [router.isReady, foodId]);

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Pre-filling form with user data:', user);
      setRequestForm(prev => ({
        ...prev,
        requesterName: user.name || user.fullName || '',
        requesterEmail: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const fetchFoodData = async () => {
    try {
      console.log('Fetching food data for ID:', foodId);
      const response = await fetch(`/api/foods?id=${foodId}`);
      const result = await response.json();
      console.log('API response:', result);
      if (result.success) {
        setFoodData(result.data);
        console.log('Food data set:', result.data);
        
        // Get coordinates from the address using Google Geocoding service
        if (result.data.locationAddress) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: result.data.locationAddress }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              setMapCenter({
                lat: location.lat(),
                lng: location.lng()
              });
              console.log('Updated map center:', { lat: location.lat(), lng: location.lng() });
            } else {
              console.log('Geocoding failed:', status);
            }
          });
        }
      } else {
        console.log('API request not successful:', result.message);
      }
    } catch (error) {
      console.error('Error fetching food data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (!foodData) {
      alert('Food data not loaded. Please try again.');
      return;
    }

    if (!requestForm.requesterName || !requestForm.requesterEmail) {
      alert('Please fill in your name and email address.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Include userId if user is authenticated
      const requestData = {
        foodId: foodData._id,
        userId: isAuthenticated && user ? user.id : null,
        requesterName: requestForm.requesterName,
        requesterEmail: requestForm.requesterEmail,
        requesterPhone: requestForm.requesterPhone,
        message: requestForm.message
      };

      console.log('Submitting request with data:', requestData);
      console.log('Current user:', user);
      console.log('Is authenticated:', isAuthenticated);

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (result.success) {
        alert('Request submitted successfully! The donor will be notified.');
        console.log('Request created with ID:', result.data.requestId);
        
        // Store the request in localStorage for tracking
        const existingRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
        existingRequests.push({
          foodId: foodData._id,
          requestId: result.data.requestId,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('userRequests', JSON.stringify(existingRequests));
        
        // Redirect to food listing page with success parameter
        setTimeout(() => {
          router.push('/foodListing?requestSuccess=true');
        }, 1000);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('An error occurred while submitting your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const containerStyle = {
    width: '100%',
    height: '224px', // 56 * 4 = 224px
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FBF8]">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Request</h1>
        <p className="text-gray-700 mb-6">Confirm your claim and coordinate pickup details.</p>
        {/* Request Card */}
        {loading ? (
          <div className="flex items-center justify-center bg-white rounded-xl shadow p-6 mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        ) : foodData ? (
                    <div className="flex items-center bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{foodData.name}</h3>
                <p className="text-gray-700 text-sm">{foodData.description || `${foodData.quantity} available for pickup`}</p>
                <p className="text-gray-600 text-xs mt-2">
                  Expiry Date: {formatDate(foodData.expiryDate)} | Type: {foodData.foodType} | 
                  <a href="#map" className="underline ml-1 text-blue-600 hover:text-blue-800">{foodData.locationAddress}</a>
                </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  {foodData.foodType}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  Quantity: {foodData.quantity}
                </span>
              </div>
            </div>
            <div className="relative w-32 h-24 ml-6">
              {foodData.imageUrl ? (
                <Image
                  src={foodData.imageUrl}
                  alt={foodData.name}
                  fill
                  className="object-cover rounded-lg"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
                ) : (
          <div className="flex items-center justify-center bg-white rounded-xl shadow p-6 mb-6">
            <p className="text-gray-700 font-medium">Food item not found</p>
          </div>
        )}
        {/* Donor Info and Map Placeholder */}
        <section id="map" className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Donor Information</h2>
          <div className="flex items-center mb-4">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Donor" className="w-12 h-12 rounded-full mr-4" />
            <div>
              <div className="font-semibold text-gray-900">Superwoman</div>
              <div className="text-xs text-gray-600">created: 2 hours ago</div>
            </div>
            <span className="ml-2 text-green-600 text-xl">&#128222;</span>
          </div>
          <div className="w-full bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
            <div className="w-full" style={{ height: 224 }}>
              <LoadScript googleMapsApiKey={apiKey} libraries={["places", "geocoding"]}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '12px' }}
                  center={mapCenter}
                  zoom={15}
                  options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    zoomControl: true,
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                      }
                    ]
                  }}
                >
                  {foodData && (
                    <Marker
                      position={mapCenter}
                      title={foodData.name}
                      animation={google.maps.Animation.DROP}
                    />
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </section>

        {/* Request Form */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
            {isAuthenticated && user && (
              <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">
                Logged in as {user.name || user.email}
              </span>
            )}
          </div>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="requesterName" className="block text-sm font-semibold text-gray-800 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="requesterName"
                  name="requesterName"
                  value={requestForm.requesterName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="requesterEmail" className="block text-sm font-semibold text-gray-800 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="requesterEmail"
                  name="requesterEmail"
                  value={requestForm.requesterEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="requesterPhone" className="block text-sm font-semibold text-gray-800 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="requesterPhone"
                name="requesterPhone"
                value={requestForm.requesterPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-1">
                Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={requestForm.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                placeholder="Add any additional information or special requests..."
              />
            </div>
            <button 
              type="submit"
              disabled={submitting || !foodData}
              className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting Request...' : 'Submit Request'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

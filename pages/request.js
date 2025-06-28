import Header from '../components/Header'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useState, useRef } from 'react'
import { LoadScript, GoogleMap, Autocomplete, Marker } from '@react-google-maps/api'

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function RequestPage() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 3.0648, lng: 101.6031 });
  const autocompleteRef = useRef(null);

  const containerStyle = {
    width: '100%',
    height: '224px', // 56 * 4 = 224px
  };

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        setMapCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FBF8]">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Request</h1>
        <p className="text-gray-500 mb-6">Confirm your claim and coordinate pickup details.</p>
        {/* Request Card Placeholder */}
        <div className="flex items-center bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex-1">
            <h3 className="font-semibold">Fresh Produce</h3>
            <p className="text-gray-500 text-sm">Variety of fresh fruits and vegetables available for pickup.</p>
            <p className="text-gray-400 text-xs mt-2">Expiry Date: 2024-07-15 | 2 km away | <a href="#" className="underline">123 Maple Street</a></p>
            <button className="mt-3 bg-green-600 text-white px-4 py-1 rounded-full text-sm">Available</button>
          </div>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80" alt="Produce" className="w-32 h-24 object-cover rounded-lg ml-6" />
        </div>
        {/* Donor Info and Map Placeholder */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Donor Information</h2>
          <div className="flex items-center mb-4">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Donor" className="w-12 h-12 rounded-full mr-4" />
            <div>
              <div className="font-semibold">Superwoman</div>
              <div className="text-xs text-gray-400">created: 2 hours ago</div>
            </div>
            <span className="ml-2 text-green-600 text-xl">&#128222;</span>
          </div>
          <div className="w-full bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
            <div className="w-full flex justify-center mb-4">
              <div style={{ position: 'relative', width: '100%' }}>
                <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
                  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <input
                      id="location-search"
                      type="text"
                      placeholder="Search Location"
                      style={{
                        boxSizing: 'border-box',
                        border: '1.5px solid #e0e0e0',
                        borderRadius: '32px',
                        width: '100%',
                        padding: '14px 16px 14px 44px',
                        fontSize: '18px',
                        background: '#fff',
                        boxShadow: '0 2px 8px #e6f2ea33',
                        outline: 'none',
                        transition: 'border 0.2s',
                      }}
                      onFocus={e => e.target.style.border = '1.5px solid #bdbdbd'}
                      onBlur={e => e.target.style.border = '1.5px solid #e0e0e0'}
                    />
                  </Autocomplete>
                </LoadScript>
                <span style={{
                  position: 'absolute',
                  left: 18,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#888',
                  pointerEvents: 'none',
                  fontSize: 22
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="w-full" style={{ height: 224 }}>
              <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '12px' }}
                  center={mapCenter}
                  zoom={15}
                  options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                  }}
                >
                  <Marker position={mapCenter} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </section>
        <button className="mt-8 w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition">
          Submit Request
        </button>
      </main>
      <Footer />
    </div>
  )
}

import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { useUser } from '../contexts/UserContext'
import { Mail, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

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
  const [currentStep, setCurrentStep] = useState(0);
  const [requestForm, setRequestForm] = useState({
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    message: ''
  });

  const formSteps = [
    {
      id: 'requesterName',
      title: 'Your Name',
      subtitle: 'Please enter your full name',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      type: 'text',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      id: 'requesterEmail',
      title: 'Email Address',
      subtitle: 'We\'ll use this to contact you',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      type: 'email',
      placeholder: 'Enter your email address',
      required: true
    },
    {
      id: 'requesterPhone',
      title: 'Phone Number',
      subtitle: 'Optional - for easier coordination',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      type: 'tel',
      placeholder: 'Enter your phone number',
      required: false
    },
    {
      id: 'message',
      title: 'Additional Message',
      subtitle: 'Any special requests or information',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4-.8L3 21l1.13-3.39C3.42 16.14 3 14.87 3 13.5c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
        </svg>
      ),
      type: 'textarea',
      placeholder: 'Add any additional information or special requests...',
      required: false
    }
  ];

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
        if (result.data.locationAddress && typeof google !== 'undefined' && google.maps) {
          try {
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
          } catch (error) {
            console.log('Google Maps API not loaded yet:', error);
          }
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

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const currentField = formSteps[currentStep];
    if (currentField.required) {
      return requestForm[currentField.id] && requestForm[currentField.id].trim() !== '';
    }
    return true;
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
        const message = result.data.autoApproved 
          ? '🎉 Request automatically approved! You can now contact the donor for pickup details.'
          : 'Request submitted successfully! The donor will be notified.';
        
        alert(message);
        console.log('Request created with ID:', result.data.requestId);
        
        // Only store in localStorage for non-authenticated users as fallback
        if (!isAuthenticated || !user?.id) {
          const existingRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
          existingRequests.push({
            foodId: foodData._id,
            requestId: result.data.requestId,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('userRequests', JSON.stringify(existingRequests));
        }
        
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Request</h1>
        <p className="text-[oklch(59.6%_0.145_163.225)] mb-6">Confirm your claim and coordinate pickup details.</p>
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
            <Mail className="ml-6 text-emerald-600 w-5 h-5" />
          </div>
          <div className="w-full flex flex-col items-center">
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
                      animation={typeof google !== 'undefined' && google.maps ? google.maps.Animation.DROP : undefined}
                    />
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </section>

        {/* Multi-Step Form */}
        <section className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-[oklch(59.6%_0.145_163.225)] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Your Information</h2>
                  <p className="text-green-100 text-sm mt-1">Step {currentStep + 1} of {formSteps.length}</p>
                </div>
                {isAuthenticated && user && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-[oklch(59.6%_0.145_163.225)] text-sm font-medium">
                      Logged in as {user.name || user.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-gray-50">
                             <div className="flex items-center justify-center mb-2">
                 {formSteps.map((step, index) => (
                   <div key={step.id} className="flex items-center">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                       index <= currentStep 
                         ? 'bg-[oklch(59.6%_0.145_163.225)] text-white' 
                         : 'bg-gray-200 text-gray-500'
                     }`}>
                       {index < currentStep ? (
                         <Check className="w-4 h-4" />
                       ) : (
                         index + 1
                       )}
                     </div>
                     {index < formSteps.length - 1 && (
                       <div className={`w-40 h-1 mx-2 ${
                         index < currentStep ? 'bg-[oklch(59.6%_0.145_163.225)]' : 'bg-gray-200'
                       }`} />
                     )}
                   </div>
                 ))}
               </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={handleSubmitRequest}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6"
                  >
                    {/* Current Step Card */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        {formSteps[currentStep].icon}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{formSteps[currentStep].title}</h3>
                          <p className="text-sm text-gray-600">{formSteps[currentStep].subtitle}</p>
                        </div>
                      </div>
                      
                      {formSteps[currentStep].type === 'textarea' ? (
                                                 <textarea
                           name={formSteps[currentStep].id}
                           value={requestForm[formSteps[currentStep].id]}
                           onChange={handleInputChange}
                           rows={4}
                           className="w-full px-4 py-3 border-2 border-[#45a180] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#45a180] focus:border-[#45a180] hover:border-[#45a180] text-gray-900 bg-white transition-all duration-200 resize-none"
                           placeholder={formSteps[currentStep].placeholder}
                         />
                      ) : (
                                                 <input
                           type={formSteps[currentStep].type}
                           name={formSteps[currentStep].id}
                           value={requestForm[formSteps[currentStep].id]}
                           onChange={handleInputChange}
                           required={formSteps[currentStep].required}
                           className="w-full px-4 py-3 border-2 border-[#45a180] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#45a180] focus:border-[#45a180] hover:border-[#45a180] text-gray-900 bg-white transition-all duration-200"
                           placeholder={formSteps[currentStep].placeholder}
                         />
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </button>

                      {currentStep < formSteps.length - 1 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!canProceed()}
                          className="flex items-center gap-2 px-6 py-3 text-[oklch(59.6%_0.145_163.225)] hover:text-[oklch(59.6%_0.145_163.225)] transition-all duration-300 transform hover:scale-105 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                        >
                          Next
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          type="submit"
                          disabled={submitting || !foodData || !canProceed()}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {submitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting Request...
                            </>
                          ) : (
                            'Submit Request'
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

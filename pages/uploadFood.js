import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import confettiAnimation from '../public/animations/confetti.json';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';

export default function UploadFood() {
  console.log('--- Loading latest version of uploadFood.js ---');
  const [formData, setFormData] = useState({
    name: '',
    foodType: '',
    quantity: '',
    expiryDate: '',
    description: '',
    locationAddress: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded) {
      // Get user's initial location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMarkerPosition(location);
          updateLocationAddress(location);
        },
        () => {
          // Default to Singapore if geolocation fails
          const defaultLocation = { lat: 1.3521, lng: 103.8198 };
          setUserLocation(defaultLocation);
          setMarkerPosition(defaultLocation);
          updateLocationAddress(defaultLocation);
        }
      );
    }
  }, [isLoaded]); // Runs when isLoaded changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setUserLocation(location); // Update map center
        setMarkerPosition(location); // Update marker position
        
        // Update form data with formatted address
        setFormData(prev => ({
          ...prev,
          locationAddress: place.formatted_address || place.name || ''
        }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setMessage('');
    } else {
      setMessage('Please upload a valid image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          setMessage('Image size must be less than 5MB');
          return;
        }
        setImage(file);
        setMessage('');
        // Update the file input's files as well
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
      } else {
        setMessage('Please upload a valid image file');
      }
    }
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Add all form fields with proper values
      formDataToSend.append('name', formData.name || 'Food Item');
      formDataToSend.append('foodType', formData.foodType);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('expiryDate', formData.expiryDate);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('locationAddress', formData.locationAddress);
      
      // Add image if selected
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch('/api/foods', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Food item added successfully!');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
        // Reset form
        setFormData({
          name: '',
          foodType: '',
          quantity: '',
          expiryDate: '',
          description: '',
          locationAddress: ''
        });
        setImage(null);
        // Reset file input
        document.getElementById('image').value = '';
      } else {
        setMessage(result.message || 'Failed to add food item');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while adding the food item');
    } finally {
      setLoading(false);
    }
  };


  
  const updateLocationAddress = (latLng) => {
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setFormData(prev => ({
            ...prev,
            locationAddress: results[0].formatted_address
          }));
        }
      });
    }
  };



  return (
    <>
      <Head>
        <title>Upload Food - FoodBridge</title>
        <meta name="description" content="Upload food items to share with the community" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {showConfetti && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
            <Lottie animationData={confettiAnimation} loop={false} />
          </div>
        )}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900">List Your Surplus Food</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Form inputs */}
            <div className="lg:w-1/2 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Food Type */}
                <div>
                  <div className="bg-green-50 rounded-md p-4 border border-green-100">
                    <select
                      id="foodType"
                      name="foodType"
                      required
                      value={formData.foodType}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-gray-700 focus:outline-none"
                      style={{ appearance: 'none' }}
                    >
                      <option value="">Select Food Type</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Grains">Grains</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Meat">Meat</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Prepared Meals">Prepared Meals</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <div className="bg-green-50 rounded-md p-4 border border-green-100">
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-gray-700 focus:outline-none"
                      placeholder="Quantity (e.g., 2, 5, 10)"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <div className="bg-green-50 rounded-md p-4 border border-green-100">
                    <DatePicker
                      id="expiryDate"
                      name="expiryDate"
                      selected={formData.expiryDate ? new Date(formData.expiryDate) : null}
                      onChange={(date) => {
                        setFormData(prev => ({
                          ...prev,
                          expiryDate: date ? date.toISOString().split('T')[0] : ''
                        }));
                      }}
                      className="w-full bg-transparent text-gray-700 focus:outline-none"
                      placeholderText="Expiry Date (MM/DD/YYYY) "
                      dateFormat="MM/dd/yyyy"
                      minDate={new Date()}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="bg-green-50 rounded-md p-4 border border-green-100">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-gray-700 focus:outline-none resize-none"
                      placeholder="Description (optional)"
                    />
                  </div>
                </div>



                {/* Food Name */}
                <div>
                  <div className="bg-green-50 rounded-md p-4 border border-green-100">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-gray-700 focus:outline-none"
                      placeholder="Food Item Name (e.g., Fresh Apples, Rice, etc.)"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="mt-10">
                  <div 
                    ref={dropAreaRef}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <svg className={`w-12 h-12 mx-auto ${isDragging ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {isDragging ? 'Drop the image here' : 'Upload a Photo (Optional)'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isDragging ? 'Release to upload' : 'Drag & drop an image here, or click to select'}
                      </p>
                      
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleClickUpload}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          Select Image
                        </button>
                        <input
                          ref={fileInputRef}
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                      {image && (
                        <div className="mt-4 p-3 bg-green-50 rounded-md inline-flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-green-700">{image.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="ml-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Remove</span>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Supports JPG, PNG up to 5MB</p>
                </div>

                {/* Message */}
                {message && (
                  <div className={`p-3 rounded-md ${message.includes('success') 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    }`}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
            </form>
            </div>
            
            {/* Right column - Map and location */}
            <div className="lg:w-1/2">
              <div className="bg-green-50 rounded-md p-4 border border-green-100 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Set Location</h3>
                {isLoaded ? (
                  <>
                    <div className="mb-4">
                      <Autocomplete
                        onLoad={onLoad}
                        onPlaceChanged={onPlaceChanged}
                      >
                        <input
                          type="text"
                          placeholder="Enter location or drag the marker"
                          className="w-full bg-white text-gray-700 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          defaultValue={formData.locationAddress}
                        />
                      </Autocomplete>
                    </div>
                    <div className="h-96 rounded-md flex-grow" style={{ minHeight: '300px' }}>
                      {userLocation && (
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '0.375rem' }}
                          center={userLocation}
                          zoom={15}
                        >
                          {markerPosition && (
                            <Marker
                              position={markerPosition}
                              draggable={true}
                              onDragEnd={(e) => {
                                const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                                setMarkerPosition(newPos);
                                updateLocationAddress(newPos);
                              }}
                            />
                          )}
                        </GoogleMap>
                      )}
                    </div>
                  </>
                ) : loadError ? (
                  <div>Error loading maps. Please try again later.</div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">Loading Map...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

export default function UploadFood() {
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
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.id = 'google-maps-script';
      script.onload = () => {
        setIsScriptLoaded(true);
        if (initMap) initMap();
      };
      document.body.appendChild(script);

      return () => {
        const scriptElement = document.getElementById('google-maps-script');
        if (scriptElement) {
          document.body.removeChild(scriptElement);
        }
      };
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

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
        
        // Update map and marker
        if (map && marker) {
          map.setCenter(location);
          marker.setPosition(location);
        }
        
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
        setMessage('Food item added successfully!');
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

  const initMap = () => {
    if (typeof window !== 'undefined') {
      // Get user location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          // Initialize map
          const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 15
          });
          setMap(mapInstance);
          
          // Add marker
          const newMarker = new window.google.maps.Marker({
            position: location,
            map: mapInstance,
            draggable: true
          });
          setMarker(newMarker);
          
          // Update location address when marker is dragged
          newMarker.addListener('dragend', () => {
            updateLocationAddress(newMarker.getPosition());
          });
        },
        () => {
          // Default to Singapore if geolocation fails
          const defaultLocation = { lat: 1.3521, lng: 103.8198 };
          setUserLocation(defaultLocation);
          
          const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
            center: defaultLocation,
            zoom: 12
          });
          setMap(mapInstance);
          
          const newMarker = new window.google.maps.Marker({
            position: defaultLocation,
            map: mapInstance,
            draggable: true
          });
          setMarker(newMarker);
          
          newMarker.addListener('dragend', () => {
            updateLocationAddress(newMarker.getPosition());
          });
        }
      );
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

  const handleAddressSearch = (address) => {
    if (window.google && window.google.maps && map) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          // Move marker to new location
          marker.setPosition(results[0].geometry.location);
          map.setCenter(results[0].geometry.location);
          
          // Update form data with formatted address
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
                      className="w-full bg-transparent focus:outline-none"
                      style={{ appearance: 'none', color: '#45a180' }}
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
                      className="w-full bg-transparent focus:outline-none"
                      style={{ color: '#45a180' }}
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
                      className="w-full bg-transparent focus:outline-none"
                      style={{ color: '#45a180', '::placeholder': { color: '#45a180' } }}
                      placeholderText="Expiry Date (MM/DD/YYYY)"
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
                      className="w-full bg-transparent focus:outline-none resize-none"
                      style={{ color: '#45a180' }}
                      placeholder="Description (optional)"
                    />
                  </div>
                </div>

                {/* Location Address */}
                <div className="relative">
                  {isScriptLoaded ? (
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                      options={{
                        types: ['geocode', 'establishment'],
                        componentRestrictions: { country: 'my' },
                        fields: ['formatted_address', 'geometry', 'name']
                      }}
                    >
                      <div className="bg-green-50 rounded-md p-4 border border-green-100">
                        <input
                          id="locationAddress"
                          name="locationAddress"
                          type="text"
                          required
                          value={formData.locationAddress}
                          onChange={handleInputChange}
                          className="w-full bg-transparent focus:outline-none"
                          style={{ color: '#45a180' }}
                          placeholder="Search for a location or address"
                        />
                        <div className="absolute right-3 top-3 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </Autocomplete>
                  ) : (
                    <div className="bg-green-50 rounded-md p-4 border border-green-100">
                      <input
                        id="locationAddress"
                        name="locationAddress"
                        type="text"
                        required
                        value={formData.locationAddress}
                        onChange={handleInputChange}
                        className="w-full bg-transparent text-gray-700 focus:outline-none"
                        placeholder="Loading map..."
                        disabled
                      />
                    </div>
                  )}
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
                      className="w-full bg-transparent focus:outline-none"
                      style={{ color: '#45a180' }}
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
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#45a180]"
                          style={{ backgroundColor: '#45a180', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#378667'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#45a180'}
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
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#45a180]"
                    style={{ 
                      backgroundColor: loading ? '#9CA3AF' : '#45a180',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#378667')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#45a180')}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
            </form>
            </div>
            
            {/* Right column - Map */}
            <div className="lg:w-1/2">
              <div id="map" className="w-full h-96 rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        #map {
          min-height: 400px;
        }
        
        /* DatePicker custom styles */
        .react-datepicker__input-container input {
          color: #45a180 !important;
        }
        .react-datepicker__input-container input::placeholder {
          color: #45a180 !important;
          opacity: 1;
        }
        .react-datepicker__day {
          color: #45a180;
        }
        .react-datepicker__day:hover {
          background-color: #E5F5F0;
        }
        .react-datepicker__day--selected {
          background-color: #45a180 !important;
          color: white !important;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: #45a180 !important;
          color: white !important;
        }
        .react-datepicker__header {
          background-color: #E5F5F0;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: #45a180;
        }
        .react-datepicker__month-select,
        .react-datepicker__year-select {
          color: #45a180;
        }
      `}</style>
    </>
  );
}

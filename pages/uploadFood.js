import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import React from 'react';
import Image from 'next/image';

// Custom Input component
const CustomInput = React.forwardRef(({ className, type, value, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow placeholder:text-gray-500/70 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{ color: value ? 'oklch(59.6% 0.145 163.225)' : '#6b7280' }}
      ref={ref}
      {...props}
    />
  );
});

// Add this at the top after imports
CustomInput.displayName = 'CustomInput';

// Custom Select component
const CustomSelect = ({
  options,
  label,
  value,
  placeholder,
  disabled = false,
  onChange,
  name
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          name={name}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className="flex h-9 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-sm shadow-sm shadow-black/5 transition-shadow placeholder:text-gray-500/70 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ color: value ? 'oklch(59.6% 0.145 163.225)' : '#6b7280' }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 pointer-events-none">
          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>
  );
};

// Custom Label component
const Label = ({ children, htmlFor, className = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium mb-2 ${className}`} style={{ color: '#000000' }}>
      {children}
    </label>
  );
};

// Custom Textarea component
const Textarea = ({ className, value, ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow placeholder:text-gray-500/70 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`}
      style={{ color: value ? 'oklch(59.6% 0.145 163.225)' : '#6b7280' }}
      {...props}
    />
  );
};

// Custom Button component
const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow hover:shadow-lg",
    outline: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    ghost: "hover:bg-gray-100 text-gray-900",
  };
  
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

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
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Food type options
  const foodTypeOptions = [
    { value: "Fruits", label: "Fruits" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Grains", label: "Grains" },
    { value: "Dairy", label: "Dairy" },
    { value: "Meat", label: "Meat" },
    { value: "Seafood", label: "Seafood" },
    { value: "Beverages", label: "Beverages" },
    { value: "Snacks", label: "Snacks" },
    { value: "Prepared Meals", label: "Prepared Meals" },
    { value: "Other", label: "Other" },
  ];

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
      // Add userId if authenticated
      if (isAuthenticated && user && user.id) {
        formDataToSend.append('userId', user.id);
      }
      
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
        // Redirect to food listing page
        router.push('/foodListing');
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

  const initMap = useCallback(() => {
    if (typeof window !== 'undefined' && window.google) {
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
  }, []); // Empty dependency array as it doesn't depend on component props/state

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.id = 'google-maps-script';
        script.onload = () => {
          setIsScriptLoaded(true);
          initMap();
        };
        document.body.appendChild(script);

        return () => {
          const scriptElement = document.getElementById('google-maps-script');
          if (scriptElement) {
            document.body.removeChild(scriptElement);
          }
        };
      } else {
        // Google Maps API is already loaded
        setIsScriptLoaded(true);
        initMap();
      }
    }
  }, [initMap]);
  
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

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900">List Your Surplus Food</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Form inputs */}
            <div className="bg-white rounded-lg border shadow-sm p-6 overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Food Item Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Food Item Name</Label>
                  <CustomInput
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter food item name (e.g., Fresh Apples, Rice, etc.)"
                  />
                </div>

                {/* Food Type */}
                <div className="space-y-2">
                  <CustomSelect
                    label="Select Food Type"
                    options={foodTypeOptions}
                    value={formData.foodType}
                    placeholder="Choose food type"
                    onChange={(e) => handleInputChange(e)}
                    name="foodType"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <CustomInput
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity (e.g., 2, 5, 10)"
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (MM/DD/YYYY)</Label>
                  <div className="relative">
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
                      className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow placeholder:text-gray-500/70 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ color: formData.expiryDate ? 'oklch(59.6% 0.145 163.225)' : '#6b7280' }}
                      placeholderText="Select expiry date"
                      dateFormat="MM/dd/yyyy"
                      minDate={new Date()}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      required
                      autoComplete="off"
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>

                {/* Location Address */}
                <div className="space-y-2">
                  <Label htmlFor="locationAddress">Search for a location or address</Label>
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
                        <CustomInput
                          id="locationAddress"
                          name="locationAddress"
                          type="text"
                          required
                          value={formData.locationAddress}
                          onChange={handleInputChange}
                          placeholder="Enter location or address"
                          className="pl-9"
                        />
                      </Autocomplete>
                    ) : (
                      <CustomInput
                        id="locationAddress"
                        name="locationAddress"
                        type="text"
                        required
                        value={formData.locationAddress}
                        onChange={handleInputChange}
                        placeholder="Loading map..."
                        disabled
                        className="pl-9"
                      />
                    )}
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the food item, condition, etc. (optional)"
                  />
                </div>

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>Upload a Photo (Optional)</Label>
                  <CustomInput
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    id="image"
                    name="image"
                  />

                  {!image ? (
                    <div
                      ref={dropAreaRef}
                      onClick={handleClickUpload}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex h-32 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed transition-colors ${
                        isDragging 
                          ? 'border-emerald-500/50 bg-emerald-50' 
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="rounded-full bg-white p-3 shadow-sm">
                        <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {isDragging ? 'Drop the image here' : 'Click to select'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isDragging ? 'Release to upload' : 'or drag and drop file here'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="group relative h-32 overflow-hidden rounded-lg border">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          fill
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleClickUpload}
                            className="h-9 w-9 p-0"
                            type="button"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setImage(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="h-9 w-9 p-0"
                            type="button"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                      {image && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                          <span className="truncate">{image.name}</span>
                          <button
                            onClick={() => {
                              setImage(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="ml-auto rounded-full p-1 hover:bg-gray-100"
                            type="button"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Supports JPG, PNG up to 5MB</p>
                </div>

                {/* Message */}
                {message && (
                  <div className={`p-3 rounded-md ${message.includes('success') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Food Donation'}
                </Button>
              </form>
            </div>
            
            {/* Right column - Map */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="w-full h-full bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-white flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Location Map</h3>
                    <p className="text-sm text-gray-600">Click on the map to select a location or use the search</p>
                  </div>
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const location = {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                            };
                            
                            // Update map and marker
                            if (map && marker) {
                              map.setCenter(location);
                              marker.setPosition(location);
                              updateLocationAddress(location);
                            }
                          },
                          (error) => {
                            console.error('Error getting location:', error);
                            alert('Unable to get your current location. Please select manually.');
                          }
                        );
                      } else {
                        alert('Geolocation is not supported by this browser.');
                      }
                    }}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'white',
                      color: '#45a180',
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
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                        fill="#45a180"
                      />
                    </svg>
                    My Location
                  </button>
                </div>
                <div id="map" className="w-full h-96" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        #map {
          min-height: 400px;
        }
        
        /* DatePicker custom styles */
        .react-datepicker-wrapper {
          width: 100% !important;
        }
        .react-datepicker__input-container {
          width: 100% !important;
        }
        .react-datepicker__input-container input {
          color: oklch(59.6% 0.145 163.225) !important;
          width: 100% !important;
        }
        .react-datepicker__input-container input::placeholder {
          color: #6b7280 !important;
          opacity: 1;
        }
        .react-datepicker__day {
          color: oklch(59.6% 0.145 163.225);
        }
        .react-datepicker__day:hover {
          background-color: #E5F5F0;
        }
        .react-datepicker__day--selected {
          background-color: #10b981 !important;
          color: white !important;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: #10b981 !important;
          color: white !important;
        }
        .react-datepicker__header {
          background-color: #E5F5F0;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: oklch(59.6% 0.145 163.225);
        }
        .react-datepicker__month-select,
        .react-datepicker__year-select {
          color: oklch(59.6% 0.145 163.225);
        }
      `}</style>
    </>
  );
}
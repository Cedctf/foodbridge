import { useState } from 'react';
import Head from 'next/head';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
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

  return (
    <>
      <Head>
        <title>Upload Food - FoodBridge</title>
        <meta name="description" content="Upload food items to share with the community" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Upload Food Item</h1>
            <p className="text-gray-600 mt-2">Share your food with the community</p>
          </div>

          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Food Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Food Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Fresh Apples"
                />
              </div>

              {/* Food Type */}
              <div>
                <label htmlFor="foodType" className="block text-sm font-medium text-gray-700">
                  Food Type *
                </label>
                <select
                  id="foodType"
                  name="foodType"
                  required
                  value={formData.foodType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select food type</option>
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

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity *
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 5"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  Expiry Date *
                </label>
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional details about the food item..."
                />
              </div>

              {/* Location Address */}
              <div>
                <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700">
                  Pickup Location *
                </label>
                <textarea
                  id="locationAddress"
                  name="locationAddress"
                  rows={2}
                  required
                  value={formData.locationAddress}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter the pickup address..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Food Image (Optional)
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: JPG, PNG, GIF</p>
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
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {loading ? 'Uploading...' : 'Upload Food Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

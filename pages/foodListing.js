import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function FoodListing() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchFoods();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    if (daysLeft < 0) return { text: 'Expired', color: 'text-red-600 bg-red-100' };
    if (daysLeft === 0) return { text: 'Expires today', color: 'text-orange-600 bg-orange-100' };
    if (daysLeft <= 3) return { text: `${daysLeft} days left`, color: 'text-yellow-600 bg-yellow-100' };
    return { text: `${daysLeft} days left`, color: 'text-green-600 bg-green-100' };
  };

  const filteredAndSortedFoods = foods
    .filter(food => 
      filter === '' || food.foodType.toLowerCase().includes(filter.toLowerCase()) ||
      food.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'expiry-soon':
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        case 'expiry-later':
          return new Date(b.expiryDate) - new Date(a.expiryDate);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading food items...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Available Food - FoodBridge</title>
        <meta name="description" content="Browse available food items in your community" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                  Available Food Items
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredAndSortedFoods.length} items available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search/Filter */}
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Search by name or food type
                </label>
                <input
                  id="filter"
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search food items..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Sort */}
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="expiry-soon">Expiring soon</option>
                  <option value="expiry-later">Expiring later</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {/* Food Grid */}
          {filteredAndSortedFoods.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {filter ? 'No food items match your search.' : 'No food items available yet.'}
              </div>
              {!filter && (
                <p className="text-gray-400 mt-2">
                  Be the first to share food with the community!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedFoods.map((food) => {
                const expiryStatus = getExpiryStatus(food.expiryDate);
                
                return (
                  <div key={food._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="relative h-48 bg-gray-200">
                      {food.imageUrl ? (
                        <Image
                          src={food.imageUrl}
                          alt={food.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Expiry Badge */}
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.color}`}>
                        {expiryStatus.text}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{food.name}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                          {food.foodType}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          <span>Quantity: {food.quantity}</span>
                        </div>

                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h6m-6 0v1a2 2 0 002 2h2a2 2 0 002-2v-1" />
                          </svg>
                          <span>Expires: {formatDate(food.expiryDate)}</span>
                        </div>

                        <div className="flex items-start">
                          <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-2">{food.locationAddress}</span>
                        </div>

                        {food.description && (
                          <div className="flex items-start">
                            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="line-clamp-2">{food.description}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Posted: {formatDate(food.createdAt)}</span>
                          <button className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors">
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

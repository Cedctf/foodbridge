import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Geist } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function FoodListing() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('');
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
    .filter(food => {
      const matchesSearch = searchFilter === '' || 
        food.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        food.foodType.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesFoodType = foodTypeFilter === '' || food.foodType === foodTypeFilter;
      return matchesSearch && matchesFoodType;
    })
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
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

      <div className={`${geistSans.className} min-h-screen bg-[#f7fcfa] pb-16`}>
        {/* Header */}
        <div className="pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Available Food Items
              </h1>
              <p className="text-[#45A180]">
                {filteredAndSortedFoods.length} items available
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-none text-[#45A180] rounded-xl shadow-sm bg-white focus:outline-none"
                placeholder="Search by location or food type"
              />
            </div>

            <div className="flex gap-3 mt-3">
              <div className="flex-1">
                <button
                  onClick={() => {}}
                  className="w-full px-4 py-2 bg-[#E5F5F0] rounded-lg shadow-sm hover:bg-[#d8efe8] flex items-center justify-between"
                >
                  <span className="text-black">Location</span>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 text-gray-700">
                <select
                  value={foodTypeFilter}
                  onChange={(e) => setFoodTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[#E5F5F0] rounded-lg shadow-sm hover:bg-[#d8efe8] appearance-none cursor-pointer text-black"
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

              <div className="flex-1 text-gray-700">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-[#E5F5F0] rounded-lg shadow-sm hover:bg-[#d8efe8] appearance-none cursor-pointer text-black"
                >
                  <option value="expiry-soon">Expiry Date ↑</option>
                  <option value="expiry-later">Expiry Date ↓</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-6"></div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {/* Food Grid */}
          {filteredAndSortedFoods.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#45A180] text-lg">
                {searchFilter || foodTypeFilter ? 'No food items match your search.' : 'No food items available yet.'}
              </div>
              {!searchFilter && !foodTypeFilter && (
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
                  <div key={food._id} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all hover:scale-[1.02] border border-green-100 flex flex-col h-[500px]">
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
                    <div className="p-4 pb-2 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{food.name}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                          {food.foodType}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-[#45A180]">
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

                      <div className="mt-auto pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-[#45A180]">
                          <span>Posted: {formatDate(food.createdAt)}</span>
                          <button className="bg-[#45A180] text-white px-3 py-1 rounded-md text-sm hover:bg-[#378667] transition-all hover:scale-105">
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

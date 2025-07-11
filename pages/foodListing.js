import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Geist } from 'next/font/google';
import { useUser } from '../contexts/UserContext';
import { ProjectStatusCard } from '@/components/ui/expandable-card';
import { MapPin, Clock, Info, Package } from 'lucide-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function FoodListing() {
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [userRequests, setUserRequests] = useState([]);
  const [notification, setNotification] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchFoods = useCallback(async () => {
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
  }, []);

  const loadUserRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      let requests = [];
      
      if (isAuthenticated && user?.id) {
        try {
          // Check if API is available first
          const response = await fetch('/api/requests?userId=' + user.id, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          
          if (result.success) {
            requests = result.data || [];
          } else {
            console.error('Failed to fetch user requests:', result.message);
            // Fallback to localStorage if API fails
            const localRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
            requests = localRequests;
          }
        } catch (error) {
          console.error('Error fetching user requests:', error);
          // Fallback to localStorage on any error
          const localRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
          requests = localRequests;
        }
      } else {
        // For non-authenticated users, use localStorage
        const localRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
        
        // Only try to fetch additional details if we have network connectivity
        try {
          requests = await Promise.all(
            localRequests.map(async (localRequest) => {
              try {
                const response = await fetch('/api/requests?id=' + localRequest.requestId);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                return result.success ? result.data : null;
              } catch (error) {
                console.error('Error fetching individual request:', error);
                return null;
              }
            })
          );
          requests = requests.filter(request => request !== null);
        } catch (error) {
          console.error('Error processing local requests:', error);
          requests = localRequests; // Fallback to raw localStorage data
        }
      }
      
      setUserRequests(requests);
    } catch (error) {
      console.error('Error in loadUserRequests:', error);
      // Final fallback to localStorage
      const localRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
      setUserRequests(localRequests);
    } finally {
      setRequestsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchFoods();
    loadUserRequests();

    // Reload user requests when page regains focus (user comes back from other pages)
    const handleFocus = () => {
      loadUserRequests();
    };

    // Auto-refresh expired items every 5 minutes to keep listings current
    const intervalId = setInterval(() => {
      fetchFoods();
      // Optional: Show subtle notification that listings were refreshed
      if (foods.length > 0) {
        showNotification('Listings refreshed - expired items removed', 'info');
      }
    }, 5 * 60 * 1000); // 5 minutes

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [fetchFoods, loadUserRequests, showNotification, foods.length]);

  // Reload requests when user authentication status changes
  useEffect(() => {
    loadUserRequests();
  }, [isAuthenticated, user, loadUserRequests]);

  // Separate useEffect to handle router query changes
  useEffect(() => {
    // Check if redirected from successful request submission
    if (router.query.requestSuccess === 'true') {
      showNotification('Request automatically approved! You can contact the donor. 🎉', 'success');
      
      // Refresh both food list and user requests to reflect the changes
      fetchFoods();
      loadUserRequests();
      
      // Clean up URL parameter using Next.js router
      const { requestSuccess, ...restQuery } = router.query;
      router.replace({
        pathname: router.pathname,
        query: restQuery
      }, undefined, { shallow: true });
    }
  }, [router.query.requestSuccess, router, fetchFoods, loadUserRequests, showNotification]);

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

  const hasUserRequested = (foodId) => {
    if (isAuthenticated && user?.id) {
      // For authenticated users, check by foodId in the requests array
      return userRequests.some(request => request.foodId === foodId);
    } else {
      // For non-authenticated users, check localStorage format
      const localRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
      return localRequests.some(request => request.foodId === foodId);
    }
  };

  const handleContactClick = async (food) => {
    if (hasUserRequested(food._id)) {
      showNotification('You have already requested this food listing.', 'warning');
      return;
    }
    
    // Quick check if item is still available before redirecting
    try {
      const response = await fetch(`/api/foods?id=${food._id}`);
      const result = await response.json();
      
      if (!result.success) {
        showNotification('This food item is no longer available.', 'warning');
        fetchFoods(); // Refresh the list
        return;
      }
      
      const freshFoodData = result.data;
      if (freshFoodData.status === 'claimed') {
        showNotification('This food item has just been claimed by another user.', 'warning');
        fetchFoods(); // Refresh the list
        return;
      }
      
      // Item is still available, proceed to request page
      router.push({
        pathname: '/request',
        query: { foodId: food._id }
      });
    } catch (error) {
      console.error('Error checking food availability:', error);
      // On error, still allow proceeding - the request API will handle conflicts
      router.push({
        pathname: '/request',
        query: { foodId: food._id }
      });
    }
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
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

      <div className={`${geistSans.className} min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-16`}>
        {/* Header */}
        <div className="pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Available Food Items
              </h1>
              <p className="text-[oklch(59.6%_0.145_163.225)]">
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
                <svg className="h-5 w-5 text-[#45A180]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-none text-[#45A180] placeholder-[#45A180]/60 rounded-xl shadow-sm bg-white focus:outline-none"
                placeholder="Search by food name"
              />
            </div>

            <div className="flex gap-3 mt-3">
              <div className="flex-1">
                <select
                  value={foodTypeFilter}
                  onChange={(e) => setFoodTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 appearance-none cursor-pointer text-[oklch(59.6%_0.145_163.225)]"
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

              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 appearance-none cursor-pointer text-[oklch(59.6%_0.145_163.225)]"
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
                const daysUntilExpiry = getDaysUntilExpiry(food.expiryDate);
                
                return (
                  <ProjectStatusCard
                    key={food._id}
                    title={food.name}
                    progress={Math.max(0, Math.min(100, (daysUntilExpiry / 7) * 100))} // Convert days to percentage, max 7 days
                    dueDate={formatDate(food.expiryDate)}
                    contributors={[
                      {
                        name: food.donorName || 'Anonymous',
                        image: food.donorAvatar
                      }
                    ]}
                    tasks={[
                      { title: `Quantity: ${food.quantity}`, completed: false },
                      { title: `Type: ${food.foodType}`, completed: false },
                    ]}
                    githubStars={food.quantity}
                    openIssues={daysUntilExpiry}
                    customContent={
                      <div className="space-y-2">
                        <div className="flex items-start text-gray-900">
                          <MapPin className="w-3 h-3 mr-2 mt-1.5 flex-shrink-0" />
                          <span className="line-clamp-2">{food.locationAddress}</span>
                        </div>
                        {food.description && (
                          <div className="flex items-center text-gray-900">
                            <Info className="w-3 h-3 mr-2" />
                            <span className="line-clamp-2">{food.description}</span>
                          </div>
                        )}
                        <div className="mt-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactClick(food);
                            }}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-2 rounded-md text-sm hover:shadow-lg transition-all hover:scale-105"
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    }
                    imageUrl={food.imageUrl}
                    statusBadge={
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.color}`}>
                        {expiryStatus.text}
                      </div>
                    }
                    footerContent={
                      <div className="flex items-center justify-between w-full text-xs text-[oklch(59.6%_0.145_163.225)]">
                        <span>Posted: {formatDate(food.createdAt)}</span>
                        <span>{food.foodType}</span>
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

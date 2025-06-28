import { useProtectedRoute } from '../hooks/useAuth';
import { useUser } from '../contexts/UserContext';
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Profile() {
  // This will automatically redirect to login if user is not authenticated
  const { user, isReady } = useProtectedRoute();
  const { updateUser, logout, fetchUserImpact } = useUser();
  const [impact, setImpact] = useState(null);
  const [impactLoading, setImpactLoading] = useState(true);
  const [impactError, setImpactError] = useState('');

  // Fetch impact data when user is loaded
  useEffect(() => {
    async function loadImpactData() {
      if (user && user.id) {
        setImpactLoading(true);
        try {
          const result = await fetchUserImpact();
          if (result.success) {
            setImpact(result.impact);
            setImpactError('');
          } else {
            setImpactError(result.error || 'Failed to load impact data');
          }
        } catch (error) {
          console.error('Error loading impact data:', error);
          setImpactError('An unexpected error occurred');
        } finally {
          setImpactLoading(false);
        }
      }
    }
    
    loadImpactData();
  }, [user, fetchUserImpact]);

  // Show loading while checking authentication
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profile - FoodBridge</title>
        <meta name="description" content="Your FoodBridge profile" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-gray-600 mt-2">Manage your FoodBridge account</p>
          </div>

          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {/* User Info Display */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Impact Data */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Impact</h2>
                
                {impactLoading ? (
                  <p className="text-sm text-gray-500">Loading impact data...</p>
                ) : impactError ? (
                  <p className="text-sm text-red-500">{impactError}</p>
                ) : impact ? (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{impact.mealsProvided.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Meals Provided</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{impact.foodSavedLbs.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Food Saved (lbs)</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{impact.recipientsHelped.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Recipients Helped</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No impact data available</p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Account Actions</h2>
                
                <button
                  onClick={logout}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>

              {/* Demo: Show how to access user data */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Debug Info (User Data)</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
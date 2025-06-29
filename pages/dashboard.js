import { useAuth } from '../hooks/useAuth';
import { useUser } from '../contexts/UserContext';
import Head from 'next/head';
import Link from 'next/link';

export default function Dashboard() {
  // Optional authentication - page works for both authenticated and non-authenticated users
  const { user, isAuthenticated, loading } = useAuth();
  const { getUserField } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - FoodBridge</title>
        <meta name="description" content="Your FoodBridge dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isAuthenticated ? `Welcome back, ${user?.username}!` : 'Welcome to FoodBridge'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAuthenticated 
                ? 'Manage your food donations and requests' 
                : 'Please log in to access your personalized dashboard'
              }
            </p>
          </div>

          {isAuthenticated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Info Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          User ID
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {getUserField('id') || 'Not available'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Username Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">👤</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Username
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {getUserField('username') || 'Not available'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📧</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Email
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {getUserField('email') || 'Not available'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2 lg:col-span-3">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link 
                      href="/uploadFood"
                      className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600 transition-colors"
                    >
                      <div className="text-2xl mb-2">🍎</div>
                      <div className="font-medium">Donate Food</div>
                    </Link>
                    
                    <Link 
                      href="/foodListing"
                      className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition-colors"
                    >
                      <div className="text-2xl mb-2">🔍</div>
                      <div className="font-medium">Find Food</div>
                    </Link>
                    
                    <Link 
                      href="/profile"
                      className="bg-purple-500 text-white p-4 rounded-lg text-center hover:bg-purple-600 transition-colors"
                    >
                      <div className="text-2xl mb-2">⚙️</div>
                      <div className="font-medium">Profile Settings</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Not authenticated view
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Please Log In
              </h2>
              <p className="text-gray-600 mb-6">
                To access your personalized dashboard and manage your food donations, please log in to your account.
              </p>
              <div className="space-x-4">
                <Link 
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Log In
                </Link>
                <Link 
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 
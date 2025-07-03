import { useProtectedRoute } from '../hooks/useAuth';
import { useUser } from '../contexts/UserContext';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function getStatus(food) {
  // Check expiry status first (most important)
  const now = new Date();
  const expiry = new Date(food.expiryDate);
  if (expiry < now) return { label: 'Expired', color: 'bg-[#FFDCDC] text-[#E53E3E]' };
  
  // Check if food is claimed
  if (food.status === 'claimed') {
    return { label: 'Claimed', color: 'bg-[#CCE6FF] text-[#2B6CB0]' };
  }
  
  // Available and not expired
  return { label: 'Available', color: 'bg-[#E6F5ED] text-[#38A169]' };
}

export default function Profile() {
  // This will automatically redirect to login if user is not authenticated
  const { user, isReady } = useProtectedRoute();
  const { updateUser, logout, fetchUserImpact } = useUser();
  
  // Impact state
  const [impact, setImpact] = useState(null);
  const [impactLoading, setImpactLoading] = useState(true);
  const [impactError, setImpactError] = useState('');

  // Donations state
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [donationsError, setDonationsError] = useState('');

  // Sidebar state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Fetch donations data
  useEffect(() => {
    async function fetchDonations() {
      if (user && user.id) {
        setDonationsLoading(true);
        setDonationsError('');
        try {
          // Include all items (including claimed) for the donor's own dashboard
          const res = await fetch('/api/foods?includeAll=true');
          const data = await res.json();
          if (data.success) {
            // Only show donations by the current user
            const filtered = data.data.filter(food => food.userId === user.id);
            setDonations(filtered);
          } else {
            setDonationsError(data.message || 'Failed to fetch donations');
          }
        } catch (err) {
          console.error('Error fetching donations:', err);
          setDonationsError('An unexpected error occurred');
        } finally {
          setDonationsLoading(false);
        }
      }
    }
    
    fetchDonations();
  }, [user]);

  // Show loading while checking authentication
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-xl font-medium text-[#38A169]">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profile & Dashboard - FoodBridge</title>
        <meta name="description" content="Your FoodBridge profile and dashboard" />
      </Head>

      <div className="min-h-screen bg-[#F5F5F5] flex">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white p-2 rounded-md shadow-md text-[#38A169] hover:bg-[#E6F5ED]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Sidebar - Profile Information */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-40
          w-80 bg-white shadow-lg border-r border-[#E0E0E0] flex flex-col
          transition-transform duration-300 ease-in-out
        `}>
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profile Header */}
          <div className="p-6 border-b border-[#E0E0E0]">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#E6F5ED] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-semibold text-[#38A169]">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-[#333] mb-1">{user?.username}</h2>
              <p className="text-sm text-[#666]">{user?.email}</p>
            </div>
          </div>

          {/* Account Information */}
          <div className="p-6 border-b border-[#E0E0E0] flex-1">
            <h3 className="text-lg font-semibold text-[#333] mb-4">Account Information</h3>
            
            <div className="space-y-4">
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <label className="block text-sm font-medium text-[#666] mb-1">User ID</label>
                <p className="text-sm text-[#333] font-mono">{user?.id}</p>
              </div>
              
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <label className="block text-sm font-medium text-[#666] mb-1">Username</label>
                <p className="text-sm text-[#333]">{user?.username}</p>
              </div>
              
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <label className="block text-sm font-medium text-[#666] mb-1">Email</label>
                <p className="text-sm text-[#333]">{user?.email}</p>
              </div>
              
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <label className="block text-sm font-medium text-[#666] mb-1">Member Since</label>
                <p className="text-sm text-[#333]">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#333] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/uploadFood">
                <button className="w-full p-3 text-left text-[#38A169] hover:bg-[#E6F5ED] rounded-lg transition-colors duration-150 flex items-center">
                  <span className="mr-3">📝</span>
                  Upload Food
                </button>
              </Link>
              <Link href="/request">
                <button className="w-full p-3 text-left text-[#38A169] hover:bg-[#E6F5ED] rounded-lg transition-colors duration-150 flex items-center">
                  <span className="mr-3">📥</span>
                  View Requests
                </button>
              </Link>
              <button className="w-full p-3 text-left text-[#666] hover:bg-[#F5F5F5] rounded-lg transition-colors duration-150 flex items-center">
                <span className="mr-3">⚙️</span>
                Settings
              </button>
              <button
                onClick={logout}
                className="w-full p-3 text-left text-[#E53E3E] hover:bg-[#FFDCDC] rounded-lg transition-colors duration-150 flex items-center"
              >
                <span className="mr-3">🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Dashboard Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 mt-12 lg:mt-0">
              <h1 className="text-[36px] font-semibold text-[#333] leading-tight mb-1 font-sans">Dashboard</h1>
              <p className="text-[#38A169] text-[14px] font-normal">Welcome back, {user?.username || 'Kind Human'}!</p>
            </div>

            {/* Impact Cards */}
            <section className="mb-10">
              <h2 className="text-[20px] font-semibold text-[#333] mb-4">Your Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Meals Provided */}
                <div className="bg-[#E6F5ED] rounded-[8px] shadow-sm p-6 flex flex-col justify-center items-start min-h-[110px]">
                  <span className="text-[16px] text-[#666] font-medium mb-2">Meals Provided</span>
                  <span className="text-[32px] font-semibold text-[#333]">
                    {impactLoading ? (
                      <span className="text-[16px] text-[#38A169]">Loading...</span>
                    ) : impactError ? (
                      <span className="text-[14px] text-red-500">-</span>
                    ) : impact ? (
                      impact.mealsProvided?.toLocaleString() ?? 0
                    ) : (
                      0
                    )}
                  </span>
                </div>
                
                {/* Food Saved (lbs) */}
                <div className="bg-[#E6F5ED] rounded-[8px] shadow-sm p-6 flex flex-col justify-center items-start min-h-[110px]">
                  <span className="text-[16px] text-[#666] font-medium mb-2">Food Saved (lbs)</span>
                  <span className="text-[32px] font-semibold text-[#333]">
                    {impactLoading ? (
                      <span className="text-[16px] text-[#38A169]">Loading...</span>
                    ) : impactError ? (
                      <span className="text-[14px] text-red-500">-</span>
                    ) : impact ? (
                      impact.foodSavedLbs?.toLocaleString() ?? 0
                    ) : (
                      0
                    )}
                  </span>
                </div>
                
                {/* Recipients Helped */}
                <div className="bg-[#E6F5ED] rounded-[8px] shadow-sm p-6 flex flex-col justify-center items-start min-h-[110px]">
                  <span className="text-[16px] text-[#666] font-medium mb-2">Recipients Helped</span>
                  <span className="text-[32px] font-semibold text-[#333]">
                    {impactLoading ? (
                      <span className="text-[16px] text-[#38A169]">Loading...</span>
                    ) : impactError ? (
                      <span className="text-[14px] text-red-500">-</span>
                    ) : impact ? (
                      impact.recipientsHelped?.toLocaleString() ?? 0
                    ) : (
                      0
                    )}
                  </span>
                </div>
              </div>
              {impactError && !impactLoading && (
                <div className="text-red-500 text-sm mt-2">{impactError}</div>
              )}
            </section>

            {/* Action Buttons */}
            <section className="mb-6">
              <div className="flex flex-wrap gap-4">
                <Link href="/uploadFood">
                  <button className="bg-[#38A169] text-white px-6 py-3 rounded-lg hover:bg-[#2F855A] transition-colors duration-150 font-medium">
                    + Upload Food
                  </button>
                </Link>
                <Link href="/foodListing">
                  <button className="bg-white border border-[#E0E0E0] text-[#333] px-6 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors duration-150 font-medium">
                    View All Donations
                  </button>
                </Link>
                <Link href="/requestdashboard">
                  <button className="bg-white border border-[#E0E0E0] text-[#333] px-6 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors duration-150 font-medium">
                    📥 My Requests
                  </button>
                </Link>
              </div>
            </section>

            {/* Recent Donations Table */}
            <section>
              <h2 className="text-[20px] font-semibold text-[#333] mb-4">My Food Donations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-[16px] shadow-lg border border-[#E0E0E0]">
                  <thead>
                    <tr className="text-left text-[#666] text-[14px] font-semibold">
                      <th className="py-4 px-6 rounded-tl-[16px] bg-[#F5F5F5]">Image</th>
                      <th className="py-4 px-6 bg-[#F5F5F5]">Name</th>
                      <th className="py-4 px-6 bg-[#F5F5F5]">Type</th>
                      <th className="py-4 px-6 bg-[#F5F5F5]">Quantity</th>
                      <th className="py-4 px-6 bg-[#F5F5F5]">Expiry Date</th>
                      <th className="py-4 px-6 bg-[#F5F5F5]">Location</th>
                      <th className="py-4 px-6 rounded-tr-[16px] bg-[#F5F5F5]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationsLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#38A169]">Loading...</td>
                      </tr>
                    ) : donationsError ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-red-500">{donationsError}</td>
                      </tr>
                    ) : donations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#666]">
                          No donations found. 
                          <Link href="/uploadFood" className="text-[#38A169] hover:underline ml-1">
                            Upload your first food donation!
                          </Link>
                        </td>
                      </tr>
                    ) : (
                                          donations.slice(0, 10).map((donation, idx) => {
                      const status = getStatus(donation);
                      const isLast = idx === Math.min(donations.length, 10) - 1;
                        return (
                          <tr
                            key={donation._id || idx}
                            className={`transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'} hover:bg-[#E6F5ED]`}
                          >
                            <td className={`py-4 px-6 ${idx === 0 ? 'rounded-tl-[16px]' : ''} ${isLast ? 'rounded-bl-[16px]' : ''}`}>
                              {donation.imageUrl ? (
                                <img
                                  src={donation.imageUrl}
                                  alt={donation.name}
                                  className="w-14 h-14 object-cover rounded-md border border-[#E0E0E0] shadow-md"
                                />
                              ) : (
                                <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">No Image</div>
                              )}
                            </td>
                            <td className="py-4 px-6 max-w-[160px] truncate text-[#333] text-[16px] font-medium" title={donation.name}>{donation.name}</td>
                            <td className="py-4 px-6 max-w-[120px] truncate text-[#666]" title={donation.foodType}>{donation.foodType}</td>
                            <td className="py-4 px-6 text-[#38A169] font-semibold">{donation.quantity}</td>
                            <td className="py-4 px-6 text-[#666]">{donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : '-'}</td>
                            <td className="py-4 px-6 max-w-[180px] truncate text-[#666]" title={donation.locationAddress}>{donation.locationAddress}</td>
                            <td className={`py-4 px-6 ${idx === 0 ? 'rounded-tr-[16px]' : ''} ${isLast ? 'rounded-br-[16px]' : ''}`}>
                              <span className={`rounded-[16px] px-3 py-1 font-medium text-[14px] ${status.color}`}>{status.label}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
              {donations.length > 10 && (
                <div className="mt-4 text-center">
                  <Link href="/foodListing">
                    <button className="text-[#38A169] hover:underline text-sm">
                      View all {donations.length} donations →
                    </button>
                  </Link>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
} 
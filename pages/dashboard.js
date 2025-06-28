import { useAuth } from '../hooks/useAuth';
import { useUser } from '../contexts/UserContext';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function getStatus(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  if (expiry < now) return { label: 'Expired', color: 'bg-[#FFDCDC] text-[#E53E3E]' };
  // For demo, treat all non-expired as Available
  return { label: 'Available', color: 'bg-[#E6F5ED] text-[#38A169]' };
}

export default function Dashboard() {
  // Optional authentication - page works for both authenticated and non-authenticated users
  const { user, isAuthenticated, loading } = useAuth();
  const { getUserField, fetchUserImpact } = useUser();

  // Impact state
  const [impact, setImpact] = useState(null);
  const [impactLoading, setImpactLoading] = useState(true);
  const [impactError, setImpactError] = useState('');

  // Donations state
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [donationsError, setDonationsError] = useState('');

  useEffect(() => {
    async function loadImpact() {
      setImpactLoading(true);
      setImpactError('');
      try {
        const result = await fetchUserImpact();
        if (result.success) {
          setImpact(result.impact);
        } else {
          setImpactError(result.error || 'Failed to load impact data');
        }
      } catch (err) {
        setImpactError('An unexpected error occurred');
      } finally {
        setImpactLoading(false);
      }
    }
    if (isAuthenticated) {
      loadImpact();
    } else {
      setImpact(null);
      setImpactLoading(false);
      setImpactError('');
    }
  }, [isAuthenticated, fetchUserImpact]);

  useEffect(() => {
    async function fetchDonations() {
      setDonationsLoading(true);
      setDonationsError('');
      try {
        const res = await fetch('/api/foods');
        const data = await res.json();
        if (data.success) {
          // Only show donations by the current user if authenticated
          let filtered = data.data;
          if (isAuthenticated && user && user.id) {
            filtered = filtered.filter(food => food.userId === user.id);
          }
          setDonations(filtered);
        } else {
          setDonationsError(data.message || 'Failed to fetch donations');
        }
      } catch (err) {
        setDonationsError('An unexpected error occurred');
      } finally {
        setDonationsLoading(false);
      }
    }
    fetchDonations();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-xl font-medium text-[#38A169]">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - FoodBridge</title>
        <meta name="description" content="Your FoodBridge dashboard" />
      </Head>
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-between">
        <main className="max-w-5xl mx-auto w-full py-12 px-4 sm:px-8">
          <div className="mb-8">
            <h1 className="text-[36px] font-semibold text-[#333] leading-tight mb-1 font-sans">Dashboard</h1>
            <p className="text-[#38A169] text-[14px] font-normal mb-6">Welcome back, Very Super Kind Human!</p>
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

          {/* Recent Donations Table */}
          <section>
            <h2 className="text-[20px] font-semibold text-[#333] mb-4">Recent Donations</h2>
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
                      <td colSpan={7} className="py-8 text-center text-[#666]">No donations found.</td>
                    </tr>
                  ) : (
                    donations.slice(0, 5).map((donation, idx) => {
                      const status = getStatus(donation.expiryDate);
                      const isLast = idx === Math.min(donations.length, 5) - 1;
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
                              <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">No Image</div>
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
          </section>
        </main>
      </div>
    </>
  );
} 
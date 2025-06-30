import { useAuth } from '../hooks/useAuth';
import { useUser } from '../contexts/UserContext';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Mock data for requests - in a real app, this would come from API
const mockRequests = [
  {
    id: 1,
    title: "Fresh Produce Box",
    expiryTime: "2 hours",
    status: "pending",
    imageUrl: "/food-images/image-1751134294751-772150386.jpg",
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    description: "Assorted fresh vegetables and fruits"
  },
  {
    id: 2,
    title: "Bakery Surplus",
    expiryTime: "1 day",
    status: "pending",
    imageUrl: "/food-images/image-1751134500396-239599783.jpg",
    requestedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    description: "Fresh bread and pastries"
  },
  {
    id: 3,
    title: "Canned Goods",
    expiryTime: "3 days",
    status: "pending",
    imageUrl: "/food-images/image-1751135869040-714805904.jpg",
    requestedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    description: "Non-perishable canned items"
  }
];

export default function RequestDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user requests
    const fetchRequests = async () => {
      setRequestsLoading(true);
      try {
        // In a real app, this would be an API call like:
        // const response = await fetch('/api/requests');
        // const data = await response.json();
        
        // For now, we'll use mock data
        setTimeout(() => {
          setRequests(mockRequests);
          setRequestsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setRequestsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const filterRequests = (status) => {
    if (status === 'all') return requests;
    return requests.filter(request => request.status === status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-[#E6F5ED] text-[#38A169]';
      case 'accepted':
        return 'bg-[#CCE6FF] text-[#2B6CB0]';
      case 'expired':
        return 'bg-[#FFDCDC] text-[#E53E3E]';
      default:
        return 'bg-[#E6F5ED] text-[#38A169]';
    }
  };

  const getTabStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return `px-6 py-3 text-[16px] font-medium cursor-pointer transition-all duration-200 border-b-2 ${
      isActive 
        ? 'text-[#38A169] border-[#38A169]' 
        : 'text-[#666666] border-transparent hover:text-[#38A169]'
    }`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-xl font-medium text-[#38A169]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#333333] mb-4">Authentication Required</h1>
          <p className="text-[#666666]">Please log in to view your requests.</p>
        </div>
      </div>
    );
  }

  const filteredRequests = filterRequests(activeTab);

  return (
    <>
      <Head>
        <title>My Requests - FoodBridge</title>
        <meta name="description" content="View and manage your food requests on FoodBridge" />
      </Head>
      
      <div className="min-h-screen bg-[#F5F5F5]">
        <main className="max-w-5xl mx-auto w-full py-12 px-4 sm:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[36px] font-semibold text-[#333333] leading-tight mb-2 font-sans">
              My Requests
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 border-b border-[#E0E0E0]">
            <nav className="flex space-x-0">
              <button
                onClick={() => setActiveTab('all')}
                className={getTabStyle('all')}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={getTabStyle('pending')}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={getTabStyle('accepted')}
              >
                Accepted
              </button>
            </nav>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {requestsLoading ? (
              <div className="text-center py-12">
                <div className="text-[#38A169] text-lg">Loading your requests...</div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-[#666666] text-lg mb-2">No requests found</div>
                <p className="text-[#666666] text-sm">
                  {activeTab === 'all' 
                    ? "You haven't made any food requests yet." 
                    : `No ${activeTab} requests found.`}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div 
                  key={request.id}
                  className="bg-[#FFFFFF] rounded-[8px] shadow-sm border border-[#E0E0E0] p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Food Image */}
                      <div className="w-16 h-16 rounded-[8px] overflow-hidden bg-[#F5F5F5] flex-shrink-0">
                        {request.imageUrl ? (
                          <Image
                            src={request.imageUrl}
                            alt={request.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#666666]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Request Details */}
                      <div className="flex-grow">
                        <h3 className="text-[16px] font-semibold text-[#333333] mb-1">
                          {request.title}
                        </h3>
                        <p className="text-[14px] text-[#666666]">
                          Expires in {request.expiryTime}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center space-x-3">
                      <button className="bg-[#38A169] text-[#FFFFFF] px-6 py-2 rounded-[4px] text-[16px] font-semibold hover:bg-[#2F855A] transition-colors duration-200">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}

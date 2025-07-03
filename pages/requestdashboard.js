
import { useUser } from '../contexts/UserContext';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';



export default function RequestDashboard() {
  const { user, isAuthenticated, loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setRequestsLoading(true);
      setError(null);
      
      try {
        // Check localStorage for user requests (for non-authenticated users)
        const localRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
        
        let userRequestsData = [];
        
        if (isAuthenticated && user?.id) {
          // Fetch requests from API for authenticated users
          const response = await fetch(`/api/requests?userId=${user.id}`);
          const result = await response.json();
          
          if (result.success) {
            userRequestsData = result.data;
          } else {
            throw new Error(result.message || 'Failed to fetch requests');
          }
        } else {
          // Use localStorage requests for non-authenticated users
          userRequestsData = await Promise.all(
            localRequests.map(async (localRequest) => {
              try {
                const response = await fetch(`/api/requests?id=${localRequest.requestId}`);
                const result = await response.json();
                return result.success ? result.data : null;
              } catch (error) {
                console.error('Error fetching request:', error);
                return null;
              }
            })
          );
          userRequestsData = userRequestsData.filter(request => request !== null);
        }

        // Fetch food details for each request
        const requestsWithFoodDetails = await Promise.all(
          userRequestsData.map(async (request) => {
            try {
              const foodResponse = await fetch(`/api/foods?id=${request.foodId}`);
              const foodResult = await foodResponse.json();
              
              if (foodResult.success) {
                const foodData = foodResult.data;
                
                // Calculate expiry time
                const expiryDate = new Date(foodData.expiryDate);
                const now = new Date();
                const timeDiff = expiryDate - now;
                const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                
                let expiryTime;
                if (daysDiff < 0) {
                  expiryTime = 'Expired';
                } else if (daysDiff === 0) {
                  expiryTime = 'Today';
                } else if (daysDiff === 1) {
                  expiryTime = '1 day';
                } else {
                  expiryTime = `${daysDiff} days`;
                }

                return {
                  id: request._id,
                  requestId: request._id,
                  title: foodData.name,
                  description: foodData.description || `${foodData.quantity} available`,
                  expiryTime,
                  status: request.status,
                  imageUrl: foodData.imageUrl,
                  requestedAt: new Date(request.createdAt),
                  foodType: foodData.foodType,
                  quantity: foodData.quantity,
                  locationAddress: foodData.locationAddress,
                  requesterName: request.requesterName,
                  requesterEmail: request.requesterEmail,
                  message: request.message
                };
              } else {
                // Food not found, return request with minimal info
                return {
                  id: request._id,
                  requestId: request._id,
                  title: 'Food item not found',
                  description: 'This food item may have been removed',
                  expiryTime: 'Unknown',
                  status: request.status,
                  imageUrl: null,
                  requestedAt: new Date(request.createdAt),
                  requesterName: request.requesterName,
                  requesterEmail: request.requesterEmail,
                  message: request.message
                };
              }
            } catch (error) {
              console.error('Error fetching food details:', error);
              // Return request with minimal info on error
              return {
                id: request._id,
                requestId: request._id,
                title: 'Error loading food details',
                description: 'Unable to load food information',
                expiryTime: 'Unknown',
                status: request.status,
                imageUrl: null,
                requestedAt: new Date(request.createdAt),
                requesterName: request.requesterName,
                requesterEmail: request.requesterEmail,
                message: request.message
              };
            }
          })
        );

        // Sort by most recent first
        requestsWithFoodDetails.sort((a, b) => b.requestedAt - a.requestedAt);
        
        setRequests(requestsWithFoodDetails);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError(error.message);
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchRequests();
  }, [isAuthenticated, user]);

  const filterRequests = (status) => {
    if (status === 'all') return requests;
    return requests.filter(request => request.status === status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-[#E6F5ED] text-[#38A169]';
      case 'approved':
      case 'accepted':
        return 'bg-[#CCE6FF] text-[#2B6CB0]';
      case 'rejected':
        return 'bg-[#FFDCDC] text-[#E53E3E]';
      case 'completed':
        return 'bg-[#E6E6FA] text-[#6B46C1]';
      case 'expired':
        return 'bg-[#FFDCDC] text-[#E53E3E]';
      default:
        return 'bg-[#E6F5ED] text-[#38A169]';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTabStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return `px-6 py-3 text-[16px] font-medium cursor-pointer transition-all duration-200 border-b-2 ${
      isActive 
        ? 'text-[#38A169] border-[#38A169]' 
        : 'text-[#666666] border-transparent hover:text-[#38A169]'
    }`;
  };

  const handleContactDonor = (request) => {
    // Store request context for the chat
    sessionStorage.setItem('chatContext', JSON.stringify({
      type: 'contact_donor',
      requestId: request.requestId,
      foodTitle: request.title,
      requesterName: request.requesterName,
      timestamp: new Date().toISOString()
    }));
    
    // Navigate to chat page to contact the donor
    router.push('/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-xl font-medium text-[#38A169]">Loading...</div>
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
            <div className="flex items-center justify-between">
              <p className="text-[#666666]">
                {requestsLoading ? 'Loading...' : `${requests.length} total request${requests.length !== 1 ? 's' : ''}`}
                {filteredRequests.length !== requests.length && !requestsLoading && (
                  <span> • {filteredRequests.length} {activeTab}</span>
                )}
              </p>
              <div className="flex items-center space-x-3">
                {!isAuthenticated && (
                  <div className="text-[12px] text-[#666666] bg-[#F0F0F0] px-3 py-1 rounded-[4px]">
                    Showing local requests
                  </div>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="text-[14px] text-[#38A169] hover:text-[#2F855A] transition-colors"
                  title="Refresh requests"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
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
                onClick={() => setActiveTab('approved')}
                className={getTabStyle('approved')}
              >
                Approved
              </button>
            </nav>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {error ? (
              <div className="text-center py-12">
                <div className="text-[#E53E3E] text-lg mb-2">Error loading requests</div>
                <p className="text-[#666666] text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-[#38A169] text-white px-4 py-2 rounded-md hover:bg-[#2F855A] transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : requestsLoading ? (
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
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-[16px] font-semibold text-[#333333]">
                            {request.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-[4px] text-[12px] font-medium ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#666666] mb-1">
                          {request.description}
                        </p>
                        <div className="flex items-center space-x-4 text-[12px] text-[#666666]">
                          <span>Expires: {request.expiryTime}</span>
                          <span>Requested: {formatDate(request.requestedAt)}</span>
                          {request.foodType && <span>Type: {request.foodType}</span>}
                        </div>
                        {request.message && (
                          <p className="text-[12px] text-[#666666] mt-2 italic">
                            Message: "{request.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Additional Info & Actions */}
                    <div className="flex flex-col items-end space-y-2 text-right">
                      <div className="text-[12px] text-[#666666]">
                        Request ID: {request.requestId.slice(-8)}
                      </div>
                      {request.locationAddress && (
                        <div className="text-[12px] text-[#666666] max-w-[200px] truncate">
                          📍 {request.locationAddress}
                        </div>
                      )}
                      
                      {/* Contact Button - Show for pending and approved requests */}
                      {(request.status === 'pending' || request.status === 'approved' || request.status === 'accepted') && (
                        <button
                          onClick={() => handleContactDonor(request)}
                          className="mt-2 bg-[#38A169] hover:bg-[#2F855A] text-white px-4 py-2 rounded-[6px] text-[14px] font-medium transition-colors duration-200 flex items-center space-x-2"
                          title="Contact the donor"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                          <span>Contact Donor</span>
                        </button>
                      )}
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

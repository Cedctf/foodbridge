import { useUser } from '../contexts/UserContext';
import Head from 'next/head';
import { useState, useEffect, useId, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { RotateCcw, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const useOutsideClick = (ref, callback) => {
  const handleCallback = useCallback(callback, [callback]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleCallback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handleCallback]);
};

export default function RequestDashboard() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    const fetchRequests = async () => {
      setRequestsLoading(true);
      setError(null);
      try {
        const localRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
        let userRequestsData = [];

        if (isAuthenticated && user?.id) {
          const response = await fetch(`/api/requests?userId=${user.id}`);
          const result = await response.json();
          if (result.success) {
            userRequestsData = result.data;
          } else {
            throw new Error(result.message || 'Failed to fetch requests');
          }
        } else {
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

        const requestsWithFoodDetails = await Promise.all(
          userRequestsData.map(async (request) => {
            try {
              const foodResponse = await fetch(`/api/foods?id=${request.foodId}`);
              const foodResult = await foodResponse.json();
              if (foodResult.success) {
                const foodData = foodResult.data;
                const expiryDate = new Date(foodData.expiryDate);
                const now = new Date();
                const timeDiff = expiryDate - now;
                const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                let expiryTime = `${daysDiff} days`;
                if (daysDiff < 0) expiryTime = 'Expired';
                else if (daysDiff === 0) expiryTime = 'Today';
                else if (daysDiff === 1) expiryTime = '1 day';

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
              }
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
            } catch (error) {
              console.error('Error fetching food details:', error);
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

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActiveCard(null);
      }
    }
    if (activeCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCard]);

  useOutsideClick(ref, () => setActiveCard(null));

  const filterRequests = (status) => {
    if (status === 'all') return requests;
    return requests.filter(request => request.status === status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-[#CCE6FF] text-[#2B6CB0]';
      case 'approved':
      case 'accepted': return 'bg-[#E6F5ED] text-[#38A169]';
      case 'rejected': return 'bg-[#FFDCDC] text-[#E53E3E]';
      case 'completed': return 'bg-[#E6E6FA] text-[#6B46C1]';
      case 'expired': return 'bg-[#FFDCDC] text-[#E53E3E]';
      default: return 'bg-[#E6F5ED] text-[#38A169]';
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
    sessionStorage.setItem('chatContext', JSON.stringify({
      type: 'contact_donor',
      requestId: request.requestId,
      foodTitle: request.title,
      requesterName: request.requesterName,
      timestamp: new Date().toISOString()
    }));
    router.push('/chat');
  };

  const filteredRequests = filterRequests(activeTab);

  return (
    <>
      <Head>
        <title>My Requests - FoodBridge</title>
        <meta name="description" content="View and manage your food requests" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
            <p className="text-[oklch(59.6%_0.145_163.225)]">Track your food requests and their status</p>
          </div>

          <div className="mb-8 border-b border-[#E0E0E0]">
            <nav className="flex space-x-0">
              <button onClick={() => setActiveTab('all')} className={getTabStyle('all')}>All</button>
              <button onClick={() => setActiveTab('pending')} className={getTabStyle('pending')}>Pending</button>
              <button onClick={() => setActiveTab('approved')} className={getTabStyle('approved')}>Approved</button>
              <button onClick={() => setActiveTab('completed')} className={getTabStyle('completed')}>Completed</button>
            </nav>
          </div>

          {requestsLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {!requestsLoading && filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <RotateCcw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">You haven&apos;t made any requests yet.</p>
            </div>
          )}

          <AnimatePresence>
            {activeCard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 h-full w-full z-10"
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {activeCard ? (
              <div className="fixed inset-0 grid place-items-center z-[100]">
                <motion.button
                  key={`button-close-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                  onClick={() => setActiveCard(null)}
                >
                  <X className="h-4 w-4 text-black" />
                </motion.button>
                <motion.div
                  layoutId={`card-${activeCard.title}-${id}`}
                  ref={ref}
                  className="w-full max-w-[400px] h-full md:h-fit md:max-h-[80%] flex flex-col bg-white sm:rounded-3xl overflow-hidden"
                  transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.6 }}
                >
                  <motion.div
                    layoutId={`image-${activeCard.title}-${id}`}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  >
                    {activeCard.imageUrl ? (
                      <Image
                        src={activeCard.imageUrl}
                        alt={activeCard.title}
                        width={400}
                        height={250}
                        className="w-full h-64 object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                  <div>
                    <div className="flex justify-between items-start p-4">
                      <div>
                        <motion.h3
                          layoutId={`title-${activeCard.title}-${id}`}
                          className="font-bold text-gray-900"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        >
                          {activeCard.title}
                        </motion.h3>
                        <motion.p
                          layoutId={`description-${activeCard.description}-${id}`}
                          className="text-gray-600"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        >
                          {activeCard.description}
                        </motion.p>
                      </div>
                      <motion.button
                        layoutId={`button-${activeCard.title}-${id}`}
                        onClick={() => handleContactDonor(activeCard)}
                        className="px-4 py-3 text-sm rounded-full font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                        transition={{ type: "spring", stiffness: 600, damping: 45 }}
                      >
                        Contact Donor
                      </motion.button>
                    </div>
                    <div className="pt-4 relative px-4">
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-gray-600 text-sm h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto"
                        transition={{ type: "spring", stiffness: 400, damping: 35, delay: 0.1 }}
                      >
                        <div className="space-y-3 w-full">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activeCard.status)}`}>
                              {activeCard.status.charAt(0).toUpperCase() + activeCard.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Requested:</span>
                            <span>{formatDate(activeCard.requestedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Expires:</span>
                            <span>{activeCard.expiryTime}</span>
                          </div>
                          {activeCard.locationAddress && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                              <span className="text-sm">{activeCard.locationAddress}</span>
                            </div>
                          )}
                          {activeCard.message && (
                            <div>
                              <span className="font-medium">Message:</span>
                              <p className="text-sm mt-1">{activeCard.message}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>

          <ul className="w-full space-y-4">
            {filteredRequests.map((request) => (
              <motion.div
                layoutId={`card-${request.title}-${id}`}
                key={`card-${request.title}-${id}`}
                onClick={() => setActiveCard(request)}
                className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-gray-100 rounded-xl cursor-pointer transition-all duration-200"
              >
                <div className="flex gap-4 flex-col md:flex-row">
                  <motion.div layoutId={`image-${request.title}-${id}`}>
                    {request.imageUrl ? (
                      <Image
                        src={request.imageUrl}
                        alt={request.title}
                        width={100}
                        height={100}
                        className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-center"
                      />
                    ) : (
                      <div className="h-40 w-40 md:h-14 md:w-14 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                  <div>
                    <motion.h3
                      layoutId={`title-${request.title}-${id}`}
                      className="font-medium text-gray-900 text-center md:text-left"
                    >
                      {request.title}
                    </motion.h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(request.requestedAt)}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  layoutId={`button-${request.title}-${id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContactDonor(request);
                  }}
                  className="px-4 py-2 text-sm rounded-full font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 mt-4 md:mt-0"
                >
                  Contact Donor
                </motion.button>
              </motion.div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
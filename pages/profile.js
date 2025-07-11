import { useProtectedRoute } from '../hooks/useAuth';
import { useUser } from '../contexts/UserContext';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Home, Settings, Bell, Upload, FileText, LogOut, Package, MapPin, BookOpen, Menu, X } from "lucide-react";

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

const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between py-2 px-4 rounded-xl hover:bg-gray-100"
        onClick={() => setOpen(!open)}>
        <span className="font-semibold">{title}</span>
        {open ? <XIcon /> : <MenuIcon />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden">
            <div className="p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuIcon = () => (
  <motion.svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <motion.line x1="3" y1="12" x2="21" y2="12" />
  </motion.svg>
);

const XIcon = () => (
  <motion.svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <motion.line x1="18" y1="6" x2="6" y2="18" />
    <motion.line x1="6" y1="6" x2="18" y2="18" />
  </motion.svg>
);

// Add SidebarToggleIcon component for the sidebar toggle button
const SidebarToggleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="7" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="7" x2="16" y2="25" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

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

  // Sidebar state
  const [isOpen, setIsOpen] = useState(true); // Start with sidebar open
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
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

      <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileSidebarVariants}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-50 bg-white text-black">
              <div className="flex flex-col h-full">
                {/* Profile Section */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#E6F5ED] rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-[#38A169]">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                {/* Navigation Section */}
                <nav className="flex-1 p-4 overflow-y-auto">
                  <ul>
                    <li className="mb-2">
                      <Link href="/">
                        <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                          <Home className="h-5 w-5" />
                          Home
                        </button>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link href="/uploadFood">
                        <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                          <Upload className="h-5 w-5" />
                          Upload Food
                        </button>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link href="/foodListing">
                        <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                          <Package className="h-5 w-5" />
                          View Donations
                        </button>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link href="/requestdashboard">
                        <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                          <FileText className="h-5 w-5" />
                          My Requests
                        </button>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link href="/map">
                        <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                          <MapPin className="h-5 w-5" />
                          Map
                        </button>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link href="/blog">
                        <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                          <BookOpen className="h-5 w-5" />
                          Blog
                        </button>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                        <Bell className="h-5 w-5" />
                        Notifications
                      </button>
                    </li>
                    <li className="mb-2">
                      <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                        <Settings className="h-5 w-5" />
                        Settings
                      </button>
                    </li>
                  </ul>
                  {/* Toggleable Sections */}
                  <div className="mt-4">
                    <CollapsibleSection title="Account Info">
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <span className="font-medium">User ID:</span> {user?.id}
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <span className="font-medium">Member Since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </CollapsibleSection>
                  </div>
                </nav>
                {/* Footer / Action Button */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={logout}
                    className="w-full font-medium text-sm p-2 text-center bg-red-100 text-red-600 rounded-xl hover:bg-red-200 flex items-center justify-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <motion.div 
          className="hidden md:flex flex-col fixed top-0 left-0 h-full bg-white text-black shadow-lg justify-between"
          animate={{
            width: isOpen ? "256px" : "80px",
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}>
          {/* Profile Section */}
          <motion.div 
            className={`p-4 border-b border-gray-200`}
            animate={{
              opacity: isOpen ? 1 : 0.7,
              x: isOpen ? 0 : -10
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}>
            <div className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'}`}>
              <div className="w-12 h-12 bg-[#E6F5ED] rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-[#38A169]">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <motion.div
                animate={{
                  opacity: isOpen ? 1 : 0,
                  display: isOpen ? "block" : "none",
                }}
                transition={{ duration: 0.2 }}>
                <p className="font-semibold">{user?.username}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </motion.div>
            </div>
          </motion.div>
          {/* Navigation Section */}
          <motion.nav 
            className="flex-1 p-4 overflow-y-auto"
            animate={{
              opacity: isOpen ? 1 : 0.7,
              x: isOpen ? 0 : -10
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}>
            <ul>
              <li className="mb-2">
                <Link href="/">
                  <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100 justify-center md:justify-start">
                    <Home className="h-5 w-5 flex-shrink-0" />
                    <motion.span
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        display: isOpen ? "inline" : "none",
                      }}
                      transition={{ duration: 0.2 }}>
                      Home
                    </motion.span>
                  </button>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/uploadFood">
                  <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100 justify-center md:justify-start">
                    <Upload className="h-5 w-5 flex-shrink-0" />
                    <motion.span
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        display: isOpen ? "inline" : "none",
                      }}
                      transition={{ duration: 0.2 }}>
                      Upload Food
                    </motion.span>
                  </button>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/foodListing">
                  <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100 justify-center md:justify-start">
                    <Package className="h-5 w-5 flex-shrink-0" />
                    <motion.span
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        display: isOpen ? "inline" : "none",
                      }}
                      transition={{ duration: 0.2 }}>
                      View Donations
                    </motion.span>
                  </button>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/requestdashboard">
                  <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100 justify-center md:justify-start">
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <motion.span
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        display: isOpen ? "inline" : "none",
                      }}
                      transition={{ duration: 0.2 }}>
                      My Requests
                    </motion.span>
                  </button>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/map">
                  <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100 justify-center md:justify-start">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <motion.span
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        display: isOpen ? "inline" : "none",
                      }}
                      transition={{ duration: 0.2 }}>
                      Map
                    </motion.span>
                  </button>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/blog">
                  <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100 justify-center md:justify-start">
                    <BookOpen className="h-5 w-5 flex-shrink-0" />
                    <motion.span
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        display: isOpen ? "inline" : "none",
                      }}
                      transition={{ duration: 0.2 }}>
                      Blog
                    </motion.span>
                  </button>
                </Link>
              </li>
              <li className="mb-2">
                <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100 justify-center md:justify-start">
                  <Bell className="h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      display: isOpen ? "inline" : "none",
                    }}
                    transition={{ duration: 0.2 }}>
                    Notifications
                  </motion.span>
                </button>
              </li>
              <li className="mb-2">
                <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100 justify-center md:justify-start">
                  <Settings className="h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      display: isOpen ? "inline" : "none",
                    }}
                    transition={{ duration: 0.2 }}>
                    Settings
                  </motion.span>
                </button>
              </li>
            </ul>
            {/* Toggleable Sections */}
            <motion.div 
              className="mt-4"
              animate={{
                opacity: isOpen ? 1 : 0,
                display: isOpen ? "block" : "none",
              }}
              transition={{ duration: 0.2 }}>
              <CollapsibleSection title="Account Info">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="font-medium">User ID:</span> {user?.id}
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="font-medium">Member Since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </CollapsibleSection>
            </motion.div>
          </motion.nav>
          {/* Sign Out Button at the bottom of the sidebar */}
          <motion.div 
            className="p-4 border-t border-gray-200"
            animate={{
              opacity: isOpen ? 1 : 0.7,
              x: isOpen ? 0 : -10
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}>
            <button
              onClick={logout}
              className="w-full font-medium text-sm p-2 text-center bg-red-100 text-red-600 rounded-xl hover:bg-red-200 flex items-center justify-center gap-2">
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <motion.span
                animate={{
                  opacity: isOpen ? 1 : 0,
                  display: isOpen ? "inline" : "none",
                }}
                transition={{ duration: 0.2 }}>
                Sign Out
              </motion.span>
            </button>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div 
          className="flex-1 transition-all duration-300"
          animate={{
            marginLeft: isOpen ? "256px" : "80px",
            marginRight: "80px"
          }}
          transition={{ duration: 0.3 }}>
          {/* Sidebar Toggle Button - now above the Dashboard header */}
          <div className="pt-6 px-6 flex items-center">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center"
              title={isOpen ? "Close Sidebar" : "Open Sidebar"}
              style={{ transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }}
            >
              <motion.span
                animate={{ rotate: isOpen ? 0 : 90 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{ display: 'inline-block' }}
              >
                <SidebarToggleIcon />
              </motion.span>
            </button>
          </div>
          {/* Top bar for mobile toggle */}
          <div className="p-4 bg-white border-b border-gray-200 md:hidden flex justify-between items-center">
            <h1 className="text-xl font-bold text-[#333]">Dashboard</h1>
          </div>
          {/* Main Content */}
          <div className="p-6 pt-2">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-[36px] font-semibold text-[#333] leading-tight mb-1 font-sans">Dashboard</h1>
                <p className="text-[#38A169] text-[14px] font-normal">Welcome back, {user?.username || 'Kind Human'}!</p>
              </div>
            </div>

            {/* Impact Cards */}
            <section className="mb-10">
              <h2 className="text-[20px] font-semibold text-[#333] mb-4">Your Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Meals Provided */}
                <div className="bg-white border border-[#38A169] rounded-[8px] shadow-sm p-6 flex flex-col justify-center items-start min-h-[110px]">
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
                <div className="bg-white border border-[#38A169] rounded-[8px] shadow-sm p-6 flex flex-col justify-center items-start min-h-[110px]">
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
                <div className="bg-white border border-[#38A169] rounded-[8px] shadow-sm p-6 flex flex-col justify-center items-start min-h-[110px]">
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
                  <button className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Food
                  </button>
                </Link>
                <Link href="/foodListing">
                  <button className="bg-white border border-[#E0E0E0] text-[#333] px-6 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors duration-150 font-medium">
                    View All Donations
                  </button>
                </Link>
                <Link href="/requestdashboard">
                  <button className="bg-white border border-[#E0E0E0] text-[#333] px-6 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors duration-150 font-medium">
                    My Requests
                  </button>
                </Link>
              </div>
            </section>

            {/* Recent Donations Table */}
            <section>
              <h2 className="text-[20px] font-semibold text-[#333] mb-4">My Food Donations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-[16px] shadow-lg border border-[#E6F5ED]">
                  <thead>
                    <tr className="text-left text-[#38A169] text-[14px] font-semibold">
                      <th className="py-4 px-6 rounded-tl-[16px] bg-[#E6F5ED]">Image</th>
                      <th className="py-4 px-6 bg-[#E6F5ED]">Name</th>
                      <th className="py-4 px-6 bg-[#E6F5ED]">Type</th>
                      <th className="py-4 px-6 bg-[#E6F5ED]">Quantity</th>
                      <th className="py-4 px-6 bg-[#E6F5ED]">Expiry Date</th>
                      <th className="py-4 px-6 bg-[#E6F5ED]">Location</th>
                      <th className="py-4 px-6 rounded-tr-[16px] bg-[#E6F5ED]">Status</th>
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
                            className={`transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F0F9F4]'} hover:bg-[#E6F5ED]`}
                          >
                            <td className={`py-4 px-6 ${idx === 0 ? 'rounded-tl-[16px]' : ''} ${isLast ? 'rounded-bl-[16px]' : ''}`}>
                              {donation.imageUrl ? (
                                <Image
                                  src={donation.imageUrl}
                                  alt={donation.name}
                                  width={56}
                                  height={56}
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
        </motion.div>
      </div>
    </>
  );
} 
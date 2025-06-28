import { useState } from 'react';
import { FaUserCircle, FaBell, FaChevronDown, FaInbox, FaCog } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const profileMenu = [
  { name: 'Dashboard', href: '#', icon: <FaUserCircle className="mr-2" /> },
  { name: 'My Request', href: '#', icon: <FaUserCircle className="mr-2" /> },
  { name: 'Inbox', href: '#', icon: <FaInbox className="mr-2" /> },
  { name: 'Settings', href: '#', icon: <FaCog className="mr-2" /> },
  { name: 'Log Out', href: '#', icon: <FiLogOut className="mr-2" /> },
];

const tabs = [
  { label: 'All' },
  { label: 'Pending' },
  { label: 'Accepted' },
];

const requests = [
  {
    image: '/food-images/Fresh_Produce_Box.png',
    title: 'Fresh Produce Box',
    expires: 'Expires in 2 hours',
  },
  {
    image: '/food-images/Bakery_Surplus.png',
    title: 'Bakery Surplus',
    expires: 'Expires in 1 day',
  },
  {
    image: '/food-images/Canned_Goods.png',
    title: 'Canned Goods',
    expires: 'Expires in 3 days',
  },
];

export default function RequestDashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="w-full bg-white/90 backdrop-blur-md shadow h-[60px] flex items-center px-8 justify-between">
        <div className="flex items-center space-x-3">
          <img src="/file.svg" alt="FoodBridge Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-[#212529]">FoodBridge</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-[#212529] font-medium text-base">
          <a href="#" className="hover:text-green-600 transition-colors">Home</a>
          <a href="#" className="hover:text-green-600 transition-colors">About Us</a>
          <a href="#" className="hover:text-green-600 transition-colors">Blog</a>
          <a href="#" className="hover:text-green-600 transition-colors">Browse Food</a>
          <a href="#" className="hover:text-green-600 transition-colors">Food Map</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-full transition">Donate</button>
          <FaBell className="text-emerald-600 text-xl cursor-pointer" />
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User Avatar"
                className="w-9 h-9 rounded-full border border-emerald-100"
              />
              <FaChevronDown className="text-emerald-600" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-30 border border-emerald-100">
                {profileMenu.map((item, idx) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 transition`}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-[#212529] mb-8">My Requests</h1>
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-emerald-100 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`pb-2 px-2 text-base font-medium transition-colors duration-200 ${
                activeTab === tab.label
                  ? 'text-green-600 border-b-2 border-green-600 font-semibold'
                  : 'text-emerald-400 hover:text-emerald-700'
              }`}
              style={{ outline: 'none' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Requests List */}
        <div className="flex flex-col space-y-6">
          {requests.map((req, i) => (
            <div key={i} className="flex items-center bg-white rounded-xl shadow-sm p-4">
              <img
                src={req.image}
                alt={req.title}
                className="w-16 h-16 rounded-lg object-cover mr-6"
                style={{ borderRadius: '0.5rem' }}
              />
              <div className="flex-1">
                <div className="text-lg font-semibold text-[#212529]">{req.title}</div>
                <div className="text-sm text-green-600 mt-1">{req.expires}</div>
              </div>
              <button className="ml-6 bg-emerald-50 hover:bg-green-100 text-green-600 font-semibold px-6 py-2 rounded-full transition-all">View</button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-50 text-emerald-600 py-8 px-6 text-center border-t border-emerald-100 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-8 text-sm">
            <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-green-600 transition-colors">Help & Support</a>
          </div>
          <div className="flex space-x-4 text-xl justify-center">
            <a href="#" aria-label="Twitter" className="hover:text-green-600 transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Facebook" className="hover:text-green-600 transition-colors"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Instagram" className="hover:text-green-600 transition-colors"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="WhatsApp" className="hover:text-green-600 transition-colors"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
        <div className="mt-4 text-xs text-emerald-600">@2025 FoodBridge. All rights reserved.</div>
      </footer>
    </div>
  );
}

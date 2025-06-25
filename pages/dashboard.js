import { useEffect, useState } from 'react';
import { FaUserCircle, FaBell, FaChevronDown, FaInbox, FaCog } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const profileMenu = [
  { name: 'Dashboard', href: '#', icon: <FaUserCircle className="mr-2" /> },
  { name: 'My Request', href: '#', icon: <FaUserCircle className="mr-2" /> },
  { name: 'Inbox', href: '#', icon: <FaInbox className="mr-2" /> },
  { name: 'Settings', href: '#', icon: <FaCog className="mr-2" /> },
  { name: 'Log Out', href: '#', icon: <FiLogOut className="mr-2" /> },
];

const statusPillStyles = {
  Available: 'bg-green-100 text-green-700 rounded px-2 py-1',
  Claimed: 'bg-emerald-100 text-emerald-700 rounded px-2 py-1',
  Expired: 'bg-red-100 text-red-700 rounded px-2 py-1',
};

export default function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [impact, setImpact] = useState(null);
  const [donations, setDonations] = useState([]);
  const [refreshTime, setRefreshTime] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await fetch('/api/dashboard/impact');
      const res2 = await fetch('/api/dashboard/donations');
      const impactData = await res1.json();
      const donationData = await res2.json();
      setImpact(impactData);
      setDonations(donationData);
      setRefreshTime(Date.now());
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!impact) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-white/90 backdrop-blur-md shadow-lg h-[60px] flex items-center px-8 justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">FB</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">FoodBridge</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium text-base">
          <a href="#" className="hover:text-green-600 transition-colors">Home</a>
          <a href="#" className="hover:text-green-600 transition-colors">About Us</a>
          <a href="#" className="hover:text-green-600 transition-colors">Blog</a>
          <a href="#" className="hover:text-green-600 transition-colors">Browse Food</a>
          <a href="#" className="hover:text-green-600 transition-colors">Food Map</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-5 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">Donate</button>
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
      <main className="flex-1 max-w-5xl w-full mx-auto py-10 px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-emerald-600 text-base mb-8">Welcome back, Very Super Kind Human!</p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card label="Meals Provided" value={impact.mealsProvided} />
          <Card label="Food Saved (lbs)" value={impact.foodSavedLbs} />
          <Card label="Recipients Helped" value={impact.recipientsHelped} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left rounded-lg border border-emerald-100">
            <thead>
              <tr>
                <th className="bg-emerald-50 text-emerald-700 font-medium px-6 py-3">Item</th>
                <th className="bg-emerald-50 text-emerald-700 font-medium px-6 py-3">Quantity</th>
                <th className="bg-emerald-50 text-emerald-700 font-medium px-6 py-3">Status</th>
                <th className="bg-emerald-50 text-emerald-700 font-medium px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, i) => (
                <tr key={i} className="border-b border-emerald-100 last:border-b-0">
                  <td className="bg-white px-6 py-4 text-gray-900">{donation.item}</td>
                  <td className="bg-white px-6 py-4">
                    <a href="#" className="text-emerald-600 font-medium hover:underline">{donation.quantity}</a>
                  </td>
                  <td className="bg-white px-6 py-4">
                    <span className={
                      donation.status === 'Available' ? statusPillStyles.Available :
                      donation.status === 'Claimed' ? statusPillStyles.Claimed :
                      statusPillStyles.Expired
                    }>
                      {donation.status}
                    </span>
                  </td>
                  <td className="bg-white px-6 py-4 text-right">
                    <a href="#" className="text-emerald-600 font-medium hover:underline">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-green-50 via-white to-emerald-50 text-emerald-700 py-8 px-6 text-center border-t border-emerald-100 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
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
        <div className="mt-4 text-xs text-emerald-700">@2025 FoodBridge. All rights reserved.</div>
      </footer>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-green-50 rounded-lg p-6 flex flex-col items-start min-w-[180px]" style={{ borderRadius: '0.5rem' }}>
      <div className="text-emerald-600 text-base font-medium mb-2">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

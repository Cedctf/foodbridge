import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../contexts/UserContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="FoodBridge Logo" 
                  width={48} 
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FoodBridge
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/foodListing" className="text-gray-700 hover:text-green-600 transition-colors">Listings</Link>
            <Link href="/uploadFood" className="text-gray-700 hover:text-green-600 transition-colors">Donate</Link>
            <Link href="/blog" className="text-gray-700 hover:text-green-600 transition-colors">Blog</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.username}!</span>
                <Link href="/profile" className="text-gray-700 hover:text-green-600 transition-colors">Profile</Link>
                <button 
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-green-600 transition-colors">Login</Link>
                <Link href="/register" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

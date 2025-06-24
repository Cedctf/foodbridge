import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

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
            <div className="w-8 h-8 relative">
              <Image 
                src="/images/logo.png" 
                alt="FoodBridge Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              FoodBridge
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/foodListing" className="text-gray-700 hover:text-green-600 transition-colors">Browse Food</Link>
            <Link href="/uploadFood" className="text-gray-700 hover:text-green-600 transition-colors">Share Food</Link>
            <Link href="/login" className="text-gray-700 hover:text-green-600 transition-colors">Login</Link>
            <Link href="/register" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

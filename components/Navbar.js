import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'}`}>
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
            <Link href="/map" className="text-gray-700 hover:text-green-600 transition-colors">Map</Link>
            <Link href="/uploadFood" className="text-gray-700 hover:text-green-600 transition-colors">Donate</Link>
            <Link href="/blog" className="text-gray-700 hover:text-green-600 transition-colors">Blog</Link>
            <Link href="/profile" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../contexts/UserContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#F7FCFA] shadow-lg' : 'bg-[#F7FCFA]'}`}>
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
              <span className="text-2xl font-bold text-[#45A180]">
                FoodBridge
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/foodListing" className="text-[#45A180] hover:text-[#378667] transition-colors">Listings</Link>
            <Link href="/map" className="text-[#45A180] hover:text-[#378667] transition-colors">Map</Link>
            <Link href="/uploadFood" className="text-[#45A180] hover:text-[#378667] transition-colors">Donate</Link>
            <Link href="/blog" className="text-[#45A180] hover:text-[#378667] transition-colors">Blog</Link>
            
            <button 
              onClick={handleProfileClick}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
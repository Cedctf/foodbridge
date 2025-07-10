import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../contexts/UserContext";
import { useRouter } from "next/router";
import { Phone, User, Menu } from "lucide-react";

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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-[0_4px_32px_0_rgba(60,60,60,0.08)] border-b border-gray-100">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2 min-w-[180px]">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="FoodBridge Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">FoodBridge</span>
          </Link>
        </div>
        {/* Centered Nav Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-6 py-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/foodListing', label: 'Listings' },
              { href: '/map', label: 'Map' },
              { href: '/uploadFood', label: 'Donate' },
              { href: '/blog', label: 'Blog' },
            ].map(link => (
              <div key={link.href} className="relative flex flex-col items-center">
                <Link href={link.href} className={`px-4 py-1 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition ${router.pathname === link.href ? 'font-bold' : ''}`}>{link.label}</Link>
                {router.pathname === link.href && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-[oklch(59.6%_0.145_163.225)] shadow"></span>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Right Actions */}
        <div className="flex items-center gap-2 min-w-[60px] justify-end">
          <button onClick={handleProfileClick} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 hover:bg-gray-50 transition font-medium text-gray-700">
            <User className="w-5 h-5 text-gray-700" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
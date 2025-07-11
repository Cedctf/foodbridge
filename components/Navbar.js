import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../contexts/UserContext";
import { useRouter } from "next/router";
import { Phone, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const handleProfileClick = () => {
    router.push(isAuthenticated ? '/profile' : '/login');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/foodListing', label: 'Listings' },
    { href: '/map', label: 'Map' },
    { href: '/uploadFood', label: 'Donate' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-[0_4px_32px_0_rgba(60,60,60,0.08)] border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
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
          {/* Centered Nav Links - Desktop */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-2 px-6 py-2">
              {navLinks.map(link => (
                <div key={link.href} className="relative flex flex-col items-center">
                  <Link href={link.href} className={`px-4 py-1 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition ${router.pathname === link.href ? 'font-bold' : ''}`}>{link.label}</Link>
                  {router.pathname === link.href && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-[oklch(59.6%_0.145_163.225)] shadow"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Right Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2 justify-end">
            <button onClick={handleProfileClick} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 hover:bg-gray-50 transition font-medium text-gray-700">
              <User className="w-5 h-5 text-gray-700" />
              <span>Profile</span>
            </button>
          </div>
          {/* Hamburger Menu - Mobile */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 -mr-2">
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white"
          >
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <span className="text-lg font-semibold text-gray-800">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2">
                  <X className="w-6 h-6 text-gray-800" />
                </button>
              </div>
              
              {/* Menu Links */}
              <div className="flex flex-col items-center justify-center flex-1 gap-6">
                {navLinks.map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`text-2xl font-medium text-gray-700 hover:text-emerald-600 transition-colors ${router.pathname === link.href ? 'text-emerald-500' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Menu Footer/Profile Button */}
              <div className="p-6 border-t">
                <button onClick={() => { handleProfileClick(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white rounded-full px-4 py-3 shadow-lg hover:bg-emerald-600 transition-colors font-medium">
                  <User className="w-5 h-5" />
                  <span>{isAuthenticated ? 'My Profile' : 'Login / Sign Up'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
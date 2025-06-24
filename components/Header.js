import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full bg-green-50 flex items-center justify-center">
              <Image src="/logo.svg" alt="FoodBridge Logo" width={30} height={30} className="transition-transform group-hover:scale-110" />
            </div>
            <span className="ml-3 font-bold text-xl bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">FoodBridge</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
            About Us
          </Link>
          <Link href="/blog" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
            Contact
          </Link>
          <Link href="/browse" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
            Browse Food
          </Link>
          <Link href="/map" className="font-medium text-gray-700 hover:text-green-600 transition-colors">
            Food Map
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors shadow-sm hover:shadow-md">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium border border-gray-300 hover:border-gray-400 rounded-md transition-colors">
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
              Home
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
              About Us
            </Link>
            <Link href="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
              Blog
            </Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
              Contact
            </Link>
            <Link href="/browse" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
              Browse Food
            </Link>
            <Link href="/map" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
              Food Map
            </Link>
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-gray-200">
              <Link href="/login" className="px-3 py-2 text-center text-base font-medium text-white bg-green-500 hover:bg-green-600 rounded-md">
                Login
              </Link>
              <Link href="/register" className="mx-3 py-2 text-center text-base font-medium border border-gray-300 hover:border-gray-400 rounded-md">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

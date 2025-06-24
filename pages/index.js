import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import IntroVideo from "../components/Intro";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Show intro video first */}
      {showIntro && <IntroVideo onComplete={handleIntroComplete} />}
      
      {/* Main content - only show after intro completes */}
      {!showIntro && (
        <div className={`${geistSans.className} min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50`}>
          {/* Navigation */}
          <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">FB</span>
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

          {/* Hero Section */}
          <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
            </div>

            <div className="relative max-w-7xl mx-auto w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Hero Content */}
                <div className="space-y-8 animate-fade-in-up">
                  <div className="space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Bridge the Gap
                      </span>
                      <br />
                      <span className="text-gray-900">Between Food</span>
                      <br />
                      <span className="text-gray-900">& Community</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                      Connect with your neighbors to share fresh food, reduce waste, and build stronger communities. Every meal shared is a step towards sustainability.
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/foodListing" className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                      Explore Available Food
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    <Link href="/uploadFood" className="bg-white text-green-600 border-2 border-green-500 px-6 py-3 rounded-full text-base font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                      Share Your Food
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-8 pt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">1000+</div>
                      <div className="text-gray-600">Meals Shared</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">500+</div>
                      <div className="text-gray-600">Community Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">50+</div>
                      <div className="text-gray-600">Cities Connected</div>
                    </div>
                  </div>
                </div>

                {/* Hero Image/Animation */}
                <div className="relative animate-fade-in-right">
                  <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-90"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white p-8">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="w-12 h-12 bg-white/30 rounded-full"></div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Fresh. Local. Connected.</h3>
                        <p className="text-lg opacity-90">Building communities one meal at a time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 1s ease-out 0.3s both;
        }
      `}</style>
    </>
  );
}

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HandWrittenTitle } from './HandWrittenTitle';

export default function CallToAction() {
  return (
    <section className="relative py-20">
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Ready to make a
                  </span>
                </h2>
                <div className="-mt-4">
                  <HandWrittenTitle title="difference?" subtitle="" />
                </div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Join our community today and help reduce food waste while connecting with people in your neighborhood. Every meal shared is a step toward a more sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  Join FoodBridge
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/foodListing" className="bg-white text-emerald-500 border-2 border-emerald-500 px-6 py-3 rounded-full text-base font-semibold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  Explore Listings
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-transparent"></div>
                <img 
                  src="/images/feature-card3.png" 
                  alt="Food sharing" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

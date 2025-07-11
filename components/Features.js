import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, Clock, Calendar } from 'lucide-react';

export default function Features() {
  const sectionRef = useRef(null);
  const featureRefs = useRef([]);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const handleMouseEnter = (videoRef) => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Video play failed:", error);
        });
      }
    }
  };

  const handleMouseLeave = (videoRef) => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }
    
    const currentFeatureRefs = featureRefs.current;
    currentFeatureRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (currentSection) observer.unobserve(currentSection);
      currentFeatureRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-4 overflow-hidden min-h-screen">
      <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center">
        <div 
          ref={el => featureRefs.current[5] = el}
          className="text-center mb-12 opacity-0"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Our Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools to help you manage and track your food donations efficiently
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1: Food Donating System */}
          <div
            ref={el => featureRefs.current[0] = el}
            className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 opacity-0"
            onMouseEnter={() => handleMouseEnter(videoRef1)}
            onMouseLeave={() => handleMouseLeave(videoRef1)}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Food Donating System</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Easily list your surplus food items for donation. Our system guides you through the process, making it simple to connect with those in need.
            </p>
            <div className="mt-6 rounded-lg overflow-hidden border border-gray-200/80">
              <video
                ref={videoRef1}
                src="/food-donating.mp4"
                poster="/images/feature-donating.png"
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Feature 2: Donation Requesting System */}
          <div
            ref={el => featureRefs.current[1] = el}
            className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 opacity-0"
            onMouseEnter={() => handleMouseEnter(videoRef2)}
            onMouseLeave={() => handleMouseLeave(videoRef2)}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Donation Requesting System</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Browse available food donations and make requests. Our platform ensures a fair and efficient distribution of resources to the community.
            </p>
            <div className="mt-6 rounded-lg overflow-hidden border border-gray-200/80">
              <video
                ref={videoRef2}
                src="/food-listings.mp4"
                poster="/images/feature-requesting.png"
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

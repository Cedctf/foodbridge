import { useEffect, useRef } from 'react';
import { Leaf, MapPin, Users, HeartHandshake } from 'lucide-react';

export default function Features() {
  const sectionRef = useRef(null);
  const featureRefs = useRef([]);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-4 overflow-hidden min-h-screen">
      <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center">
        <div 
          ref={el => featureRefs.current[5] = el}
          className="text-center mb-16 opacity-0"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Why Choose FoodBridge
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting communities through food sharing with our innovative platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div 
            ref={el => featureRefs.current[0] = el}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group opacity-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 mb-6 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reduce Food Waste</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with your community to share surplus food instead of throwing it away. 
                Every item shared makes a difference in reducing food waste.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            ref={el => featureRefs.current[1] = el}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group opacity-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 mb-6 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Food Near You</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover available food donations near you with our interactive map. Find fresh meals and ingredients
                in your local area with just a few taps.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            ref={el => featureRefs.current[2] = el}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group opacity-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 mb-6 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Donate Food</h3>
              <p className="text-gray-600 leading-relaxed">
                Make a difference by donating surplus food. Connect with local charities and community members
                who can benefit from your contributions.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div 
            ref={el => featureRefs.current[3] = el}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group md:col-span-2 lg:col-span-1 opacity-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 mb-6 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h3>
              <p className="text-gray-600 leading-relaxed">
                Join our community of food heroes today. Whether you're donating or looking for food, our platform
                makes it easy to connect and make an impact.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div 
            ref={el => featureRefs.current[4] = el}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group md:col-span-2 lg:col-span-2 opacity-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 mb-6 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Be part of a movement that fights food waste and hunger. Track your impact and see how your
                contributions help build a more sustainable and caring community.
              </p>
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

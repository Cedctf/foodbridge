import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
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
                Share fresh food with neighbors and reduce waste together.
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
            {/* <div className="grid grid-cols-3 gap-8 pt-8">
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
            </div> */}
          </div>

          {/* Hero Image/Animation */}
          <div className="relative animate-fade-in-right">
                <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src="/Intro.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
        </div>
      </div>

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
    </section>
  );
}

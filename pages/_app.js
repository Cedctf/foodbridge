import "@/styles/globals.css";
import { useState } from "react";
import Chatbot from "../components/Chatbot";
import '../styles/globals.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserProvider } from "../contexts/UserContext";
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { MessageCircle, X } from "lucide-react";

export default function App({ Component, pageProps }) {
  const [showChatbot, setShowChatbot] = useState(false);
  const router = useRouter();
  
  // Check if current page is profile page
  const isProfilePage = router.pathname === '/profile';

  return (
    <UserProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900 flex flex-col justify-between relative">
        {/* Global Animated Background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animate-delay-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float animate-delay-1000"></div>
          <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-float animate-delay-300"></div>
          <div className="absolute bottom-1/4 right-1/4 w-52 h-52 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-float animate-delay-700"></div>
        </div>

        <div className="flex flex-col flex-grow">
          {!isProfilePage && <Navbar />}
          <main className={`flex-grow ${!isProfilePage ? 'pt-20' : ''}`}>
            <Component {...pageProps} />
          </main>
        </div>
        
        {!isProfilePage && <Footer />}
        <Toaster position="bottom-center" />

        {/* Floating Chatbot Button and Modal */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          {showChatbot && (
            <div className="mb-3 shadow-2xl rounded-2xl" style={{zIndex: 1000}}>
              <Chatbot />
            </div>
          )}
          <button
            aria-label="Open Chatbot"
            onClick={() => setShowChatbot((v) => !v)}
            className="bg-gradient-to-br from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-200"
            style={{ boxShadow: '0 4px 24px #16a34a33' }}
          >
            {showChatbot ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </UserProvider>
  );
}

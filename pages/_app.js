import "@/styles/globals.css";
import { useState } from "react";
import Chatbot from "../components/Chatbot";
import '../styles/globals.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserProvider } from "../contexts/UserContext";

export default function App({ Component, pageProps }) {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
        {/* Global Animated Background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        </div>
        
        <Navbar />
        <main className="pt-16 flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
        
        {/* Floating Chatbot Button */}
        {!showChatbot && (
          <button
            className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition z-50"
            onClick={() => setShowChatbot(true)}
            style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}
          >
            Chatbot
          </button>
        )}
        
        {/* Chatbot Floating Panel */}
        {showChatbot && (
          <div
            className="fixed bottom-24 right-8 z-50"
            style={{ position: 'fixed', bottom: 96, right: 32, zIndex: 9999 }}
          >
            <div className="relative">
              <button
                className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow"
                onClick={() => setShowChatbot(false)}
                aria-label="Close Chatbot"
                style={{ position: 'absolute', top: -16, right: -16 }}
              >
                &times;
              </button>
              <Chatbot />
            </div>
          </div>
        )}
      </div>
    </UserProvider>
  );
}

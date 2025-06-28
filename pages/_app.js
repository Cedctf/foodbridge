import "@/styles/globals.css";
import { useState } from "react";
import Chatbot from "../components/Chatbot";

export default function App({ Component, pageProps }) {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <>
      <Component {...pageProps} />
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
    </>
  );
}

import '../styles/globals.css';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { UserProvider } from "../contexts/UserContext";

export default function App({ Component, pageProps }) {
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
    </div>
    </UserProvider>
  );
}

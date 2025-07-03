import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ChatbotPage() {
  return (
    <>
      <div className={`${geistSans.className} min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50`}>
        {/* <Navbar /> */}
        <Hero />
        <Features />
        <Testimonials />
        <CallToAction />
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
    </>
  );
}

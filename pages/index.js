import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "../components/Header";
import Features from "../components/Features";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}>
      <Header />
      <main className="flex-grow">
        <Features />
        <div className="max-w-6xl mx-auto px-4 py-8">
         
        </div>
      </main>
      <Footer />
    </div>
  );
}

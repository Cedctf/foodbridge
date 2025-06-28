"use client"
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow py-4 px-8 flex items-center justify-between">
      <div className="flex items-center">
        <span className="font-bold text-2xl text-green-700 mr-4">FoodBridge</span>
      </div>
      <nav className="flex items-center space-x-6">
        <Link href="/"><span className="hover:text-green-700 cursor-pointer">Home</span></Link>
        <Link href="#"><span className="hover:text-green-700 cursor-pointer">About Us</span></Link>
        <Link href="#"><span className="hover:text-green-700 cursor-pointer">Blog</span></Link>
        <Link href="#"><span className="hover:text-green-700 cursor-pointer">Browse Food</span></Link>
        <Link href="#"><span className="hover:text-green-700 cursor-pointer">Food Map</span></Link>
        <Link href="#"><button className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition">Donate</button></Link>
      </nav>
    </header>
  )
} 
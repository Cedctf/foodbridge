import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="FoodBridge Logo" width={30} height={30} />
          <span className="ml-2 font-bold text-lg">FoodBridge</span>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/" className="text-gray-700 hover:text-gray-900">
          Home
        </Link>
        <Link href="/about" className="text-gray-700 hover:text-gray-900">
          About Us
        </Link>
        <Link href="/blog" className="text-gray-700 hover:text-gray-900">
          Blog
        </Link>
        <Link href="/browse" className="text-gray-700 hover:text-gray-900">
          Browse Food
        </Link>
        <Link href="/map" className="text-gray-700 hover:text-gray-900">
          Food Map
        </Link>
      </nav>
      
      <div className="flex items-center space-x-3">
        <Link href="/login" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
          Login
        </Link>
        <Link href="/register" className="border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md">
          Sign Up
        </Link>
      </div>
    </header>
  );
}

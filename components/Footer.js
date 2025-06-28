import Link from 'next/link'
import { FaTwitter, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white py-6 px-4 mt-8 border-t text-gray-400 text-sm">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex space-x-6 mb-2 md:mb-0">
          <Link href="#"><span className="hover:text-green-700 cursor-pointer">Privacy Policy</span></Link>
          <Link href="#"><span className="hover:text-green-700 cursor-pointer">Terms of Service</span></Link>
          <Link href="#"><span className="hover:text-green-700 cursor-pointer">Help & Support</span></Link>
        </div>
        <div className="flex space-x-4">
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
        </div>
      </div>
      <div className="text-center mt-4">©2025 FoodBridge. All rights reserved.</div>
    </footer>
  )
} 
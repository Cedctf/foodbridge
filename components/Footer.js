import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (  
    <footer className="bg-white py-8 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
          </div>
          
          <div className="text-center">
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
          </div>
          
          <div className="text-right">
            <Link href="/support" className="text-sm text-gray-600 hover:text-gray-900">
              Help & Support
            </Link>
          </div>
        </div>
        
        <div className="flex justify-center space-x-6 mb-6">
          <Link href="https://twitter.com/foodbridge" aria-label="Twitter">
            <Image src="/icons/twitter.svg" alt="Twitter" width={20} height={20} />
          </Link>
          <Link href="https://facebook.com/foodbridge" aria-label="Facebook">
            <Image src="/icons/facebook.svg" alt="Facebook" width={20} height={20} />
          </Link>
          <Link href="https://instagram.com/foodbridge" aria-label="Instagram">
            <Image src="/icons/instagram.svg" alt="Instagram" width={20} height={20} />
          </Link>
          <Link href="https://wa.me/foodbridge" aria-label="WhatsApp">
            <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
          </Link>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          &copy;{currentYear} FoodBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
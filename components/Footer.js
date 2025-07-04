import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (  
    <footer className="bg-gradient-to-br from-white via-green-25 to-emerald-50 py-8 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/privacy" className="text-sm text-[oklch(59.6%_0.145_163.225)] hover:opacity-80">
              Privacy Policy
            </Link>
          </div>
          
          <div className="text-center">
            <Link href="/terms" className="text-sm text-[oklch(59.6%_0.145_163.225)] hover:opacity-80">
              Terms of Service
            </Link>
          </div>
          
          <div className="text-right">
            <Link href="/support" className="text-sm text-[oklch(59.6%_0.145_163.225)] hover:opacity-80">
              Help & Support
            </Link>
          </div>
        </div>
        
        <div className="flex justify-center space-x-6 mb-6">
          <Link href="https://twitter.com/foodbridge" aria-label="Twitter" className="text-[oklch(59.6%_0.145_163.225)]">
            <Image src="/icons/twitter.svg" alt="Twitter" width={20} height={20} className="[&>path]:fill-current" />
          </Link>
          <Link href="https://facebook.com/foodbridge" aria-label="Facebook" className="text-[oklch(59.6%_0.145_163.225)]">
            <Image src="/icons/facebook.svg" alt="Facebook" width={20} height={20} className="[&>path]:fill-current" />
          </Link>
          <Link href="https://instagram.com/foodbridge" aria-label="Instagram" className="text-[oklch(59.6%_0.145_163.225)]">
            <Image src="/icons/instagram.svg" alt="Instagram" width={20} height={20} className="[&>path]:fill-current" />
          </Link>
          <Link href="https://wa.me/foodbridge" aria-label="WhatsApp" className="text-[oklch(59.6%_0.145_163.225)]">
            <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={20} height={20} className="[&>path]:fill-current" />
          </Link>
        </div>
        
        <div className="text-center text-sm text-[oklch(59.6%_0.145_163.225)]">
          &copy;{currentYear} FoodBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
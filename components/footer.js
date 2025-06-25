import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="mt-auto bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-5">
        <div className="h-50 px-5 py-10 flex flex-col gap-6">
          {/* Footer Links */}
          <div className="flex justify-between items-center flex-wrap">
            <div className="w-40 min-w-40 flex flex-col items-center">
              <Link href="#" className="text-center hover:opacity-80 transition-opacity" style={{ color: '#45A180', fontSize: '16px', fontFamily: 'Plus Jakarta Sans', fontWeight: 400, lineHeight: '24px' }}>
                Privacy Policy
              </Link>
            </div>
            <div className="w-40 min-w-40 flex flex-col items-center">
              <Link href="#" className="text-center hover:opacity-80 transition-opacity" style={{ color: '#45A180', fontSize: '16px', fontFamily: 'Plus Jakarta Sans', fontWeight: 400, lineHeight: '24px' }}>
                Terms of Service
              </Link>
            </div>
            <div className="w-40 min-w-40 flex flex-col items-center">
              <Link href="#" className="text-center hover:opacity-80 transition-opacity" style={{ color: '#45A180', fontSize: '16px', fontFamily: 'Plus Jakarta Sans', fontWeight: 400, lineHeight: '24px' }}>
                Help & Support
              </Link>
            </div>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex justify-center items-start gap-4 flex-wrap">
            {/* Instagram Icon */}
            <div className="flex flex-col items-center">
              <Link href="#" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1.8C12.67 1.8 12.987 1.81 14.04 1.86C15.016 1.907 15.546 2.066 15.898 2.204C16.365 2.386 16.698 2.602 17.048 2.952C17.398 3.302 17.614 3.635 17.796 4.102C17.934 4.454 18.093 4.984 18.14 5.96C18.19 7.013 18.2 7.33 18.2 10C18.2 12.67 18.19 12.987 18.14 14.04C18.093 15.016 17.934 15.546 17.796 15.898C17.614 16.365 17.398 16.698 17.048 17.048C16.698 17.398 16.365 17.614 15.898 17.796C15.546 17.934 15.016 18.093 14.04 18.14C12.987 18.19 12.67 18.2 10 18.2C7.33 18.2 7.013 18.19 5.96 18.14C4.984 18.093 4.454 17.934 4.102 17.796C3.635 17.614 3.302 17.398 2.952 17.048C2.602 16.698 2.386 16.365 2.204 15.898C2.066 15.546 1.907 15.016 1.86 14.04C1.81 12.987 1.8 12.67 1.8 10C1.8 7.33 1.81 7.013 1.86 5.96C1.907 4.984 2.066 4.454 2.204 4.102C2.386 3.635 2.602 3.302 2.952 2.952C3.302 2.602 3.635 2.386 4.102 2.204C4.454 2.066 4.984 1.907 5.96 1.86C7.013 1.81 7.33 1.8 10 1.8ZM10 0C7.284 0 6.944 0.012 5.877 0.06C4.813 0.108 4.086 0.278 3.45 0.525C2.785 0.78 2.222 1.122 1.662 1.662C1.122 2.222 0.78 2.785 0.525 3.45C0.278 4.086 0.108 4.813 0.06 5.877C0.012 6.944 0 7.284 0 10C0 12.716 0.012 13.056 0.06 14.123C0.108 15.187 0.278 15.914 0.525 16.55C0.78 17.215 1.122 17.778 1.662 18.338C2.222 18.878 2.785 19.22 3.45 19.475C4.086 19.722 4.813 19.892 5.877 19.94C6.944 19.988 7.284 20 10 20C12.716 20 13.056 19.988 14.123 19.94C15.187 19.892 15.914 19.722 16.55 19.475C17.215 19.22 17.778 18.878 18.338 18.338C18.878 17.778 19.22 17.215 19.475 16.55C19.722 15.914 19.892 15.187 19.94 14.123C19.988 13.056 20 12.716 20 10C20 7.284 19.988 6.944 19.94 5.877C19.892 4.813 19.722 4.086 19.475 3.45C19.22 2.785 18.878 2.222 18.338 1.662C17.778 1.122 17.215 0.78 16.55 0.525C15.914 0.278 15.187 0.108 14.123 0.06C13.056 0.012 12.716 0 10 0Z" fill="#45A180"/>
                  <path d="M10 4.865C7.164 4.865 4.865 7.164 4.865 10C4.865 12.836 7.164 15.135 10 15.135C12.836 15.135 15.135 12.836 15.135 10C15.135 7.164 12.836 4.865 10 4.865ZM10 13.333C8.158 13.333 6.667 11.842 6.667 10C6.667 8.158 8.158 6.667 10 6.667C11.842 6.667 13.333 8.158 13.333 10C13.333 11.842 11.842 13.333 10 13.333Z" fill="#45A180"/>
                  <path d="M16.538 4.662C16.538 5.325 15.999 5.864 15.336 5.864C14.673 5.864 14.134 5.325 14.134 4.662C14.134 3.999 14.673 3.46 15.336 3.46C15.999 3.46 16.538 3.999 16.538 4.662Z" fill="#45A180"/>
                </svg>
              </Link>
            </div>
            
            {/* Facebook Icon */}
            <div className="flex flex-col items-center">
              <Link href="#" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" fill="#45A180"/>
                </svg>
              </Link>
            </div>
            
            {/* Twitter Icon */}
            <div className="flex flex-col items-center">
              <Link href="#" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" fill="#45A180"/>
                </svg>
              </Link>
            </div>
            
            {/* WhatsApp Icon */}
            <div className="flex flex-col items-center">
              <Link href="#" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.05 2.91C15.18 1.04 12.69 0 10.04 0C4.58 0 0.13 4.45 0.13 9.91c0 1.75.46 3.45 1.32 4.95L0 20l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zM10.04 18.15h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.42 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.3-.01-.46-.01a.87.87 0 00-.64.3c-.22.25-.84.82-.84 2.01 0 1.19.86 2.34.98 2.5.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z" fill="#45A180"/>
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="flex flex-col items-center">
            <div className="text-center" style={{ color: '#45A180', fontSize: '16px', fontFamily: 'Plus Jakarta Sans', fontWeight: 400, lineHeight: '24px' }}>
              @2025 FoodBridge. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
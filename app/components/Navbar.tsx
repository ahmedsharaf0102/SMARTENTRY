'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'الرئيسية', path: '/' },
    { name: 'عنّي', path: '/about' },
    { name: 'خدماتي', path: '/services' },
    { name: 'أعمالي', path: '/portfolio' },
    { name: 'تواصل معايا', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            MyWebsite
          </Link>

          <div className="hidden md:flex items-center space-x-1 space-x-reverse">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
            >
              ابدأ مشروعك
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 fade-in">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block mt-2 mx-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-lg font-bold"
            >
              ابدأ مشروعك
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
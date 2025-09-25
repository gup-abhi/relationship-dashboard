'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Relationship Insights Dashboard</h1>
      <nav className="hidden md:flex space-x-4">
        <ul className="flex space-x-4">
          <li><Link href="/" className="block py-2">Overview</Link></li>
          <li><Link href="/demographics" className="block py-2">Demographics</Link></li>
          <li><Link href="/issues" className="block py-2">Issues & Themes</Link></li>
          <li><Link href="/sentiment" className="block py-2">Sentiment Analysis</Link></li>
          <li><Link href="/trends" className="block py-2">Trends</Link></li>
        </ul>
      </nav>
      <div className="md:hidden">
        <button onClick={toggleMobileMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <MobileNav isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </header>
  );
};

export default Header;
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileNav from '@/components/MobileNav';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/demographics', label: 'Demographics' },
    { href: '/issues', label: 'Issues & Themes' },
    { href: '/sentiment', label: 'Sentiment Analysis' },
    { href: '/trends', label: 'Trends' },
  ];

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Relationship Insights Dashboard</h1>
      <nav className="hidden md:flex space-x-4">
        <ul className="flex space-x-4">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href} className={`block py-2 ${pathname === link.href ? 'text-blue-500' : ''}`}>
                {link.label}
              </Link>
            </li>
          ))}
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
'use client';

import React from 'react';
import Link from 'next/link';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 md:hidden">
      <div className="fixed top-0 right-0 w-64 h-full bg-gray-900 p-4">
        <button onClick={onClose} className="text-white mb-4">
          Close
        </button>
        <nav>
          <ul>
            <li><Link href="/" className="block py-2 text-white">Overview</Link></li>
            <li><Link href="/demographics" className="block py-2 text-white">Demographics</Link></li>
            <li><Link href="/issues" className="block py-2 text-white">Issues & Themes</Link></li>
            <li><Link href="/sentiment" className="block py-2 text-white">Sentiment Analysis</Link></li>
            <li><Link href="/trends" className="block py-2 text-white">Trends</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;

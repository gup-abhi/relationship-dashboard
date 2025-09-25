'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLinkClick = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 md:hidden">
      <div className="fixed top-0 right-0 w-64 h-full bg-gray-900 p-4">
        <button onClick={onClose} className="text-white mb-4">
          Close
        </button>
        <nav>
          <ul>
            <li><button onClick={() => handleLinkClick('/')} className="block py-2 text-white">Overview</button></li>
            <li><button onClick={() => handleLinkClick('/demographics')} className="block py-2 text-white">Demographics</button></li>
            <li><button onClick={() => handleLinkClick('/issues')} className="block py-2 text-white">Issues & Themes</button></li>
            <li><button onClick={() => handleLinkClick('/sentiment')} className="block py-2 text-white">Sentiment Analysis</button></li>
            <li><button onClick={() => handleLinkClick('/trends')} className="block py-2 text-white">Trends</button></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;

import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Relationship Insights Dashboard</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/" className="block py-2">Overview</a></li>
          <li><a href="/demographics" className="block py-2">Demographics</a></li>
          <li><a href="/issues" className="block py-2">Issues & Themes</a></li>
          <li><a href="/sentiment" className="block py-2">Sentiment Analysis</a></li>
          <li><a href="/trends" className="block py-2">Trends</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="bg-gray-700 text-white w-64 p-4">
      <nav>
        <ul>
          <li><a href="/" className="block py-2">Overview</a></li>
          <li><a href="/demographics" className="block py-2">Demographics</a></li>
          <li><a href="/issues" className="block py-2">Issues & Themes</a></li>
          <li><a href="/sentiment" className="block py-2">Sentiment Analysis</a></li>
          <li><a href="/trends" className="block py-2">Trends</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
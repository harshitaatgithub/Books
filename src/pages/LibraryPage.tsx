import React, { useState } from 'react';
import Library from './Library';
import { getUserFromToken } from '../utils/auth';

const LibraryPage: React.FC = () => {
  const user = getUserFromToken();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const showSearch = location.pathname === "/library" && user;

  return (
    <div className="p-6">
      {showSearch && (
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books..."
            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Authors</option>
            <option value="Ava Mitchell">Ava Mitchell</option>
            <option value="Emma Clarke">Emma Clarke</option>
            <option value="Grace Morgan">Grace Morgan</option>
            <option value="Henry Brooks">Henry Brooks</option>
            <option value="Liam Hayes">Liam Hayes</option>
            <option value="Lucas Gray">Lucas Gray</option>
            <option value="Mia Sullivan">Mia Sullivan</option>
            <option value="Noah Parker">Noah Parker</option>
            <option value="Olivia Bennett">Olivia Bennett</option>
            <option value="Sophia Turner">Sophia Turner</option>
          </select>
        </div>
      )}

      <Library searchQuery={searchQuery} selectedAuthor={selectedAuthor} />
    </div>
  );
};

export default LibraryPage;

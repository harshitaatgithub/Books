import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchComponentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAuthor?: string;
  setSelectedAuthor?: (author: string) => void;
  placeholder?: string;
  showAuthorFilter?: boolean;
  authors?: string[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  searchQuery,
  setSearchQuery,
  selectedAuthor = "",
  setSelectedAuthor,
  placeholder = "Search...",
  showAuthorFilter = false,
  authors = [],
}) => {
  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {showAuthorFilter && setSelectedAuthor && (
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;

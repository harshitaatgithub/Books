import React from "react";
import { useLocation } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import { FaBook, FaUser, FaSearch } from "react-icons/fa";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAuthor: string;
  setSelectedAuthor: (author: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedAuthor,
  setSelectedAuthor,
}) => {
  const user = getUserFromToken();
  const location = useLocation();

  // Show search only on library page
  const showSearch = location.pathname === "/library" && user;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <FaBook className="text-white text-2xl" />
            <div>
              <h1 className="text-white font-bold text-xl">
                Library Management
              </h1>
              <p className="text-blue-100 text-xs">Digital Book Collection</p>
            </div>
          </div>

          {/* Search Section - Only show on library page */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by book title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all"
                  />
                </div>
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 backdrop-blur rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all cursor-pointer"
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
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div className="text-sm">
                <span className="font-medium text-white">{user?.username}</span>
                <span className="ml-2 px-2 py-0.5 bg-white/20 text-white rounded-full text-xs font-medium">
                  {user?.role === "admin" ? "Admin" : "User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

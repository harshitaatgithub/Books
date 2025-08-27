import { FaBook } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

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
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // Update time every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Show search only on library page
  const showSearch = location.pathname === "/library" && user;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div
              className="flex items-center text-xl font-bold text-gray-900 cursor-pointer lg:ml-0 ml-16"
              onClick={() => user && navigate("/dashboard")}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <FaBook className="text-white" size={16} />
              </div>
              <span className="hidden sm:inline">Library Management</span>
              <span className="sm:hidden">Library</span>
            </div>
          </div>

          {/* Search Section - Only show on library page */}
          {showSearch && (
            <div className="flex-1 max-w-lg mx-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Time Display - Hidden on small screens */}
            <div className="hidden md:block text-sm text-gray-500">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden lg:inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            ) : (
              location.pathname !== "/login" && (
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

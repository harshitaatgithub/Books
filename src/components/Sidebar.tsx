import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import {
  FaHome,
  FaBook,
  FaHeart,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const user = getUserFromToken();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard", color: "blue" },
    { path: "/library", icon: FaBook, label: "Browse Books", color: "green" },
    { path: "/borrowed", icon: FaBookOpen, label: "My Books", color: "purple" },
    { path: "/favorites", icon: FaHeart, label: "Favorites", color: "pink" },
  ];

  // Add admin-only items
  if (user.role === "admin") {
    navItems.push(
      { path: "/users", icon: FaUsers, label: "Users", color: "yellow" },
      { path: "/admin", icon: FaCog, label: "Admin Panel", color: "gray" }
    );
  }

  return (
    <>
      {/* Invisible clickable area to close sidebar */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50 shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
              <FaBook className="text-blue-400 mr-2" size={24} />
              <span className="text-lg font-bold">Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ path, icon: Icon, label, color }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive(path)
                    ? `bg-${color}-600 text-white shadow-lg`
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={onClose}
              >
                <Icon
                  className={`flex-shrink-0 mr-3 ${
                    isActive(path)
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                  size={18}
                />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 group"
            >
              <FaSignOutAlt className="flex-shrink-0 mr-3" size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

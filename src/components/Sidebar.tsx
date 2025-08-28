import React, { useState } from "react";
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
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const user = getUserFromToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Force navigation and reload
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center">
            <FaBook className="text-blue-400 mr-2" size={24} />
            <span className="text-lg font-bold">Library</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors hidden lg:block"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors lg:hidden"
        >
          <FaTimes />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          )}
        </div>
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
            onClick={() => setIsMobileOpen(false)}
          >
            <Icon
              className={`flex-shrink-0 ${
                isActive(path)
                  ? "text-white"
                  : "text-gray-400 group-hover:text-white"
              }`}
              size={18}
            />
            {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 group"
        >
          <FaSignOutAlt className="flex-shrink-0" size={18} />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col fixed left-0 top-0 h-full transition-all duration-300 z-30 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-md"
      >
        <FaBars size={20} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

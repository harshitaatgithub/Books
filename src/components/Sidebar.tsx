// Save this as src/components/Sidebar.tsx
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
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
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
    navigate("/login", { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/library", icon: FaBook, label: "Browse Books" },
    { path: "/borrowed", icon: FaBookOpen, label: "My Books" },
    { path: "/favorites", icon: FaHeart, label: "Favorites" },
  ];

  // Add admin-only items
  if (user.role === "admin") {
    navItems.push(
      { path: "/users", icon: FaUsers, label: "Users" },
      { path: "/admin", icon: FaCog, label: "Admin Panel" }
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center">
            <FaBook className="text-blue-600 mr-2" size={24} />
            <span className="text-lg font-bold text-gray-800">Library</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <FaTimes />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user.username}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              isActive(path)
                ? "bg-blue-100 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setIsMobileOpen(false)}
          >
            <Icon
              className={`flex-shrink-0 ${
                isActive(path) ? "text-blue-700" : "text-gray-500"
              } group-hover:text-blue-600`}
              size={18}
            />
            {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group"
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
        className={`hidden lg:flex lg:flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <FaBars size={20} className="text-gray-600" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

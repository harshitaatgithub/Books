import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import {
  FaHome,
  FaBook,
  FaHeart,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaUser,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const user = getUserFromToken();
  const location = useLocation();

  if (!user) return null;

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

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <Icon className="mr-2" size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-full">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-800">
                  {user.username}
                </span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {user.role === "admin" ? "Admin" : "Student"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

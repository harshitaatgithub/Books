import React from "react";
import {
  FaBook,
  FaHeart,
  FaBookOpen,
  FaCalendarAlt,
  FaAward,
  FaChartLine,
  FaQuoteLeft,
} from "react-icons/fa";
import type { User } from "../types";

interface UserDashboardComponentProps {
  user: User;
  currentTime: Date;
  borrowedBooks: any[];
  favoriteBooks: any[];
}

const UserDashboardComponent: React.FC<UserDashboardComponentProps> = ({
  user,
  currentTime,
  borrowedBooks,
  favoriteBooks,
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      title: "Books Borrowed",
      value: borrowedBooks.length,
      icon: FaBookOpen,
      color: "bg-blue-500",
      trend: "+2 this month",
    },
    {
      title: "Favorites",
      value: favoriteBooks.length,
      icon: FaHeart,
      color: "bg-pink-500",
      trend: "+5 this month",
    },
    {
      title: "Books Read",
      value: borrowedBooks.length + 7,
      icon: FaBook,
      color: "bg-green-500",
      trend: "+3 this month",
    },
    {
      title: "Reading Score",
      value: "A+",
      icon: FaAward,
      color: "bg-purple-500",
      trend: "Top 10%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.username}! 👋
              </h1>
              <p className="text-gray-600 flex items-center">
                <FaCalendarAlt className="mr-2" />
                {currentDate} • {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}
                >
                  <stat.icon size={24} />
                </div>
                <FaChartLine className="text-green-500" size={16} />
              </div>
              <div className="mb-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
              <p className="text-green-600 text-xs font-medium">{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reading Goals */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartLine className="mr-2 text-purple-600" />
              Reading Goal
            </h2>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <svg className="w-20 h-20" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${
                      ((borrowedBooks.length + 7) / 24) * 100
                    }, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {Math.round(((borrowedBooks.length + 7) / 24) * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {borrowedBooks.length + 7} of 24 books this year
              </p>
              <p className="text-xs text-purple-600 font-medium">
                Great progress! Keep it up! 🎉
              </p>
            </div>
          </div>

          {/* Quote of the Day */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 space-y-4">
            <div className="flex items-start space-x-3">
              <FaQuoteLeft className="text-yellow-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-800 italic mb-3">
                  "The more that you read, the more things you will know. The
                  more that you learn, the more places you'll go."
                </p>
                <p className="text-xs text-gray-600 font-medium">— Dr. Seuss</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardComponent;

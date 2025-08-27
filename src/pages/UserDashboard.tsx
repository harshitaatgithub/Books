import React, { useState, useEffect } from "react";
import { getUserFromToken } from "../utils/auth";
import booksRaw from "../data/books.json";
import {
  FaBook,
  FaHeart,
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
  FaAward,
  FaChartLine,
  FaArrowRight,
  FaQuoteLeft,
  FaStar,
  FaFire,
} from "react-icons/fa";

const UserDashboard: React.FC = () => {
  const user = getUserFromToken();
  const [borrowedBookIds, setBorrowedBookIds] = useState<number[]>([]);
  const [favoriteBookIds, setFavoriteBookIds] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      // Load borrowed books
      const storedBorrowed = localStorage.getItem(`borrowed_${user.id}`);
      if (storedBorrowed) {
        setBorrowedBookIds(JSON.parse(storedBorrowed));
      } else {
        const initialBorrowed = booksRaw
          .filter((book) => book.borrowed_by.includes(user.id))
          .map((book) => book.id);
        setBorrowedBookIds(initialBorrowed);
      }

      // Load favorite books
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavoriteBookIds(JSON.parse(storedFavorites));
      } else {
        const initialFavorites = booksRaw
          .filter((book) => book.favorited_by.includes(user.id))
          .map((book) => book.id);
        setFavoriteBookIds(initialFavorites);
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const borrowedBooks = booksRaw.filter((book) =>
    borrowedBookIds.includes(book.id)
  );
  const favoriteBooks = booksRaw.filter((book) =>
    favoriteBookIds.includes(book.id)
  );

  // Recent activity simulation
  const recentActivity = [
    {
      action: "Borrowed",
      title: borrowedBooks[0]?.title || "The Crystal Key",
      time: "2 hours ago",
      icon: FaBookOpen,
      color: "text-green-600",
    },
    {
      action: "Added to favorites",
      title: favoriteBooks[0]?.title || "Fragments of Light",
      time: "1 day ago",
      icon: FaHeart,
      color: "text-pink-600",
    },
    {
      action: "Returned",
      title: "The Eternal Flame",
      time: "3 days ago",
      icon: FaClock,
      color: "text-blue-600",
    },
  ];

  const bookRecommendations = booksRaw.slice(0, 3);

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
      value: borrowedBooks.length + 7, // Simulate some returned books
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
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "admin" ? "Administrator" : "Student"}
                    </span>
                  </div>
                </div>
              </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaClock className="mr-2 text-blue-600" />
                  Recent Activity
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <activity.icon size={14} className={activity.color} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action}</span> "
                        {activity.title}"
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Currently Reading */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaBookOpen className="mr-2 text-green-600" />
                  Currently Reading
                </h2>
                <a
                  href="/borrowed"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All <FaArrowRight className="ml-1" size={12} />
                </a>
              </div>
              {borrowedBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {borrowedBooks.slice(0, 4).map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-500">{book.author}</p>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.floor(Math.random() * 80) + 20}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBook size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">
                    You're not currently reading any books
                  </p>
                  <a
                    href="/library"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Books <FaArrowRight className="ml-2" size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaFire className="mr-2 text-orange-600" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <a
                  href="/library"
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <FaBook className="text-blue-600 mr-3" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-800">
                      Browse Books
                    </p>
                    <p className="text-xs text-gray-500">Discover new titles</p>
                  </div>
                </a>
                <a
                  href="/favorites"
                  className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors group"
                >
                  <FaHeart className="text-pink-600 mr-3" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-pink-800">
                      My Favorites
                    </p>
                    <p className="text-xs text-gray-500">
                      {favoriteBooks.length} saved books
                    </p>
                  </div>
                </a>
                <a
                  href="/borrowed"
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                >
                  <FaBookOpen className="text-green-600 mr-3" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-green-800">
                      Borrowed Books
                    </p>
                    <p className="text-xs text-gray-500">
                      {borrowedBooks.length} books to return
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Reading Goals */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
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
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-start space-x-3">
                <FaQuoteLeft className="text-yellow-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-800 italic mb-3">
                    "The more that you read, the more things you will know. The
                    more that you learn, the more places you'll go."
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    — Dr. Seuss
                  </p>
                </div>
              </div>
            </div>

            {/* Book Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaStar className="mr-2 text-yellow-600" />
                Recommended for You
              </h2>
              <div className="space-y-3">
                {bookRecommendations.map((book) => (
                  <div key={book.id} className="flex items-center space-x-3">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-500">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="/library"
                className="block mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View More Recommendations
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

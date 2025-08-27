import React, { useState, useEffect } from "react";
import { getUserFromToken } from "../utils/auth";
import booksRaw from "../data/books.json";
import {
  FaBook,
  FaHeart,
  FaBookOpen,
  FaCalendarAlt,
  FaAward,
  FaChartLine,
  FaQuoteLeft,
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
            strokeDasharray={`${((borrowedBooks.length + 7) / 24) * 100}, 100`}
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
          "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
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

export default UserDashboard;

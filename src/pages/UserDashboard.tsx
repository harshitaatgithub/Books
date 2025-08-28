import React, { useState, useEffect } from "react";
import { getUserFromToken } from "../utils/auth";
import booksRaw from "../data/books.json";
import UserDashboardComponent from "../components/UserDashboardComponent.tsx";

const UserDashboard: React.FC = () => {
  const user = getUserFromToken();
  const [borrowedBookIds, setBorrowedBookIds] = useState<number[]>([]);
  const [favoriteBookIds, setFavoriteBookIds] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      const storedBorrowed = localStorage.getItem(`borrowed_${user.id}`);
      if (storedBorrowed) {
        setBorrowedBookIds(JSON.parse(storedBorrowed));
      } else {
        const initialBorrowed = booksRaw
          .filter((book) => book.borrowed_by.includes(user.id))
          .map((book) => book.id);
        setBorrowedBookIds(initialBorrowed);
      }

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

  const borrowedBooks = booksRaw.filter((book) =>
    borrowedBookIds.includes(book.id)
  );
  const favoriteBooks = booksRaw.filter((book) =>
    favoriteBookIds.includes(book.id)
  );

  return (
    <UserDashboardComponent
      user={user}
      currentTime={currentTime}
      borrowedBooks={borrowedBooks}
      favoriteBooks={favoriteBooks}
    />
  );
};

export default UserDashboard;

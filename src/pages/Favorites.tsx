import React, { useState, useEffect } from "react";
import booksRaw from "../data/books.json";
import { getUserFromToken } from "../utils/auth";
import type { Book } from "../types";
import { FaHeart, FaStar } from "react-icons/fa";

const Favorites: React.FC = () => {
  const user = getUserFromToken();
  const [favoriteBookIds, setFavoriteBookIds] = useState<number[]>([]);

  // Initialize favorite books from localStorage or user data
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavoriteBookIds(JSON.parse(storedFavorites));
      } else {
        // Initialize with books that have the user's ID in favorited_by array
        const initialFavorites = booksRaw
          .filter((book: any) => book.favorited_by.includes(user.id))
          .map((book: any) => book.id);
        setFavoriteBookIds(initialFavorites);
        localStorage.setItem(
          `favorites_${user.id}`,
          JSON.stringify(initialFavorites)
        );
      }
    }
  }, [user]);

  // Convert raw books to Book type with dynamic isFavorite
  const books: Book[] = booksRaw.map((book: any) => ({
    ...book,
    isFavorite: favoriteBookIds.includes(book.id),
  }));

  // Get books favorited by current user
  const currentUserFavoriteBooks = books.filter((book: Book) =>
    favoriteBookIds.includes(book.id)
  );

  const borrowBook = (bookId: number) => {
    const book = books.find((b: Book) => b.id === bookId);
    if (book) {
      const now = new Date();
      alert(
        `"${
          book.title
        }" has been borrowed on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`
      );
    }
  };

  const removeFavorite = (bookId: number) => {
    const book = books.find((b: Book) => b.id === bookId);
    if (book && user) {
      // Update local state
      const updatedFavorites = favoriteBookIds.filter(
        (id: number) => id !== bookId
      );
      setFavoriteBookIds(updatedFavorites);

      // Update localStorage
      localStorage.setItem(
        `favorites_${user.id}`,
        JSON.stringify(updatedFavorites)
      );

      alert(`"${book.title}" has been removed from your favorites.`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          My Favorite Books
        </h1>
      </div>

      {user ? (
        <>
          {/* Current Favorites Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Your favorite books ({currentUserFavoriteBooks.length})
            </h2>
            {currentUserFavoriteBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentUserFavoriteBooks.map((book: Book) => (
                  <div
                    key={book.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden border-l-4 border-pink-500 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-32 object-cover"
                      />
                      <FaHeart
                        className="absolute top-2 right-2 text-pink-500"
                        size={16}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-xs mb-2">
                        by {book.author}
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => borrowBook(book.id)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        >
                          Borrow
                        </button>
                        <button
                          onClick={() => removeFavorite(book.id)}
                          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        >
                          Remove ♥
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaHeart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  You haven't added any books to your favorites yet.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Visit the library to browse and add favorites!
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Please log in to see your favorite books.
          </p>
        </div>
      )}

      {/* Personal Statistics Section */}
      {user && (
        <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Your Favorites Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <FaHeart size={32} className="mx-auto text-pink-500 mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {currentUserFavoriteBooks.length}
              </p>
              <p className="text-gray-600">Total Favorites</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <FaStar size={32} className="mx-auto text-yellow-500 mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {currentUserFavoriteBooks.length > 0 ? "Active" : "None"}
              </p>
              <p className="text-gray-600">Collection Status</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-2xl font-bold text-gray-800">
                {
                  new Set(
                    currentUserFavoriteBooks.map((book: Book) => book.author)
                  ).size
                }
              </p>
              <p className="text-gray-600">Favorite Authors</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;

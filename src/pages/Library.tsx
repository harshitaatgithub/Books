import React, { useState, useEffect } from "react";
import booksRaw from "../data/books.json";
import { getUserFromToken } from "../utils/auth";
import { FaHeart, FaCheck } from "react-icons/fa";
import type { Book } from "../types";

interface LibraryProps {
  searchQuery: string;
  selectedAuthor: string;
}

const Library: React.FC<LibraryProps> = ({ searchQuery, selectedAuthor }) => {
  const user = getUserFromToken();
  const booksPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteBookIds, setFavoriteBookIds] = useState<number[]>([]);
  const [borrowedBookIds, setBorrowedBookIds] = useState<number[]>([]);

  // Initialize favorites and borrowed books from localStorage
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavoriteBookIds(JSON.parse(storedFavorites));
      } else {
        // Initialize with books that have the user's ID in favorited_by array
        const initialFavorites = booksRaw
          .filter((book) => book.favorited_by.includes(user.id))
          .map((book) => book.id);
        setFavoriteBookIds(initialFavorites);
        localStorage.setItem(
          `favorites_${user.id}`,
          JSON.stringify(initialFavorites)
        );
      }

      const storedBorrowed = localStorage.getItem(`borrowed_${user.id}`);
      if (storedBorrowed) {
        setBorrowedBookIds(JSON.parse(storedBorrowed));
      } else {
        // Initialize with books that have the user's ID in borrowed_by array
        const initialBorrowed = booksRaw
          .filter((book) => book.borrowed_by.includes(user.id))
          .map((book) => book.id);
        setBorrowedBookIds(initialBorrowed);
        localStorage.setItem(
          `borrowed_${user.id}`,
          JSON.stringify(initialBorrowed)
        );
      }
    }
  }, [user]);

  const toggleFavorite = (bookId: number) => {
    if (!user) return;

    let updatedFavorites;
    if (favoriteBookIds.includes(bookId)) {
      updatedFavorites = favoriteBookIds.filter((id) => id !== bookId);
    } else {
      updatedFavorites = [...favoriteBookIds, bookId];
    }

    setFavoriteBookIds(updatedFavorites);
    localStorage.setItem(
      `favorites_${user.id}`,
      JSON.stringify(updatedFavorites)
    );
  };

  const borrowBook = (book: Book) => {
    if (!user) {
      alert("Please log in to borrow books.");
      return;
    }

    if (borrowedBookIds.includes(book.id)) {
      alert("You have already borrowed this book!");
      return;
    }

    // Update local state
    const updatedBorrowed = [...borrowedBookIds, book.id];
    setBorrowedBookIds(updatedBorrowed);

    // Update localStorage
    localStorage.setItem(
      `borrowed_${user.id}`,
      JSON.stringify(updatedBorrowed)
    );

    const now = new Date();
    alert(
      `You borrowed "${
        book.title
      }" on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`
    );
  };

  const books: Book[] = booksRaw.map((book) => ({
    ...book,
    isFavorite: favoriteBookIds.includes(book.id),
  }));

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedAuthor === "" || book.author === selectedAuthor)
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentBooks.map((book: Book) => {
          const isAlreadyBorrowed = borrowedBookIds.includes(book.id);
          const isFavorited = favoriteBookIds.includes(book.id);

          return (
            <div
              key={book.id}
              className={`bg-white shadow-md rounded overflow-hidden relative transition-transform hover:scale-105 ${
                isAlreadyBorrowed
                  ? "border-l-4 border-green-500"
                  : "border-l-4 border-gray-200"
              }`}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(book.id)}
                  className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                >
                  <FaHeart color={isFavorited ? "red" : "gray"} size={16} />
                </button>

                {/* Borrowed Status Badge */}
                {isAlreadyBorrowed && (
                  <div className="bg-green-500 rounded-full p-2 shadow-md">
                    <FaCheck color="white" size={16} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-center text-lg font-semibold mb-2">
                  {book.title}
                </h2>
                <p className="text-gray-700 text-sm mb-4">{book.description}</p>
                <p className="text-right text-xs text-gray-500 mb-4">
                  — {book.author}
                </p>
                <div className="flex justify-center">
                  {!isAlreadyBorrowed ? (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full transition-colors font-semibold"
                      onClick={() => borrowBook(book)}
                    >
                      Borrow Book
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-400 text-white px-4 py-2 rounded w-full cursor-not-allowed"
                    >
                      Already Borrowed
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: 3 }, (_, i) => {
          const page = currentPage + i;
          return page <= totalPages ? (
            <button
              key={page}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ) : null;
        })}

        {currentPage + 3 < totalPages && (
          <span className="px-2 text-gray-500">...</span>
        )}
        {currentPage + 2 < totalPages && (
          <button
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        )}

        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* User Statistics */}
      {user && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Your Library Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <FaHeart size={24} className="mx-auto text-pink-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">
                {favoriteBookIds.length}
              </p>
              <p className="text-gray-600 text-sm">Favorites</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <FaCheck size={24} className="mx-auto text-green-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">
                {borrowedBookIds.length}
              </p>
              <p className="text-gray-600 text-sm">Borrowed</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-xl font-bold text-gray-800">
                {filteredBooks.length}
              </p>
              <p className="text-gray-600 text-sm">Available Books</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;

import React, { useState, useEffect } from "react";
import booksRaw from "../data/books.json";
import { getUserFromToken } from "../utils/auth";
import type { Book } from "../types";
import { FaBook, FaHeart, FaCheck, FaClock } from "react-icons/fa";

interface NewBorrowProps {
  searchQuery?: string;
  selectedAuthor?: string;
}

const NewBorrow: React.FC<NewBorrowProps> = ({
  searchQuery = "",
  selectedAuthor = "",
}) => {
  const user = getUserFromToken();
  const [borrowedBookIds, setBorrowedBookIds] = useState<number[]>([]);
  const [favoriteBookIds, setFavoriteBookIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  // Initialize borrowed books and favorites from localStorage
  useEffect(() => {
    if (user) {
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

      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavoriteBookIds(JSON.parse(storedFavorites));
      }
    }
  }, [user]);

  // Convert raw books to Book type with dynamic properties
  const books: Book[] = booksRaw.map((book) => ({
    ...book,
    isFavorite: favoriteBookIds.includes(book.id),
  }));

  const borrowBook = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book && user && !borrowedBookIds.includes(bookId)) {
      // Update local state
      const updatedBorrowed = [...borrowedBookIds, bookId];
      setBorrowedBookIds(updatedBorrowed);

      // Update localStorage
      localStorage.setItem(
        `borrowed_${user.id}`,
        JSON.stringify(updatedBorrowed)
      );

      const now = new Date();
      alert(
        `"${
          book.title
        }" has been borrowed successfully on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`
      );
    } else if (borrowedBookIds.includes(bookId)) {
      alert("You have already borrowed this book!");
    }
  };

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

  // Filter books based on search query and selected author
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedAuthor === "" || book.author === selectedAuthor)
  );

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  // Statistics
  const availableBooks = filteredBooks.filter(
    (book) => !borrowedBookIds.includes(book.id)
  );
  const borrowedBooks = filteredBooks.filter((book) =>
    borrowedBookIds.includes(book.id)
  );

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 text-lg">Please log in to borrow books.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Borrow Books</h1>
        <p className="text-gray-600">
          Browse and borrow books from our extensive collection
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <FaBook size={32} className="mx-auto text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {filteredBooks.length}
          </p>
          <p className="text-gray-600 text-sm">Total Books</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <FaCheck size={32} className="mx-auto text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {availableBooks.length}
          </p>
          <p className="text-gray-600 text-sm">Available</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <FaClock size={32} className="mx-auto text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {borrowedBooks.length}
          </p>
          <p className="text-gray-600 text-sm">You Borrowed</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 text-center">
          <FaHeart size={32} className="mx-auto text-pink-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {favoriteBookIds.length}
          </p>
          <p className="text-gray-600 text-sm">Your Favorites</p>
        </div>
      </div>

      {/* Filter Info */}
      {(searchQuery || selectedAuthor) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-700">
            {searchQuery && `Searching for: "${searchQuery}"`}
            {searchQuery && selectedAuthor && " | "}
            {selectedAuthor && `Author: ${selectedAuthor}`}
          </p>
          <p className="text-blue-600 text-sm">
            Showing {filteredBooks.length} books
          </p>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {currentBooks.map((book: Book) => {
          const isAlreadyBorrowed = borrowedBookIds.includes(book.id);
          const isFavorited = favoriteBookIds.includes(book.id);

          return (
            <div
              key={book.id}
              className={`bg-white shadow-lg rounded-lg overflow-hidden relative transition-transform hover:scale-105 ${
                isAlreadyBorrowed
                  ? "border-l-4 border-orange-500"
                  : "border-l-4 border-gray-200"
              }`}
            >
              <div className="relative">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(book.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                >
                  <FaHeart
                    color={isFavorited ? "red" : "gray"}
                    size={16}
                    className="transition-colors"
                  />
                </button>

                {/* Status Badge */}
                {isAlreadyBorrowed && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    BORROWED
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                <p className="text-gray-500 text-xs mb-4 line-clamp-3">
                  {book.description}
                </p>

                <div className="flex gap-2">
                  {!isAlreadyBorrowed ? (
                    <button
                      onClick={() => borrowBook(book.id)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors font-semibold"
                    >
                      Borrow Now
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
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

      {/* No Results Message */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <FaBook size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            No books found matching your criteria.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or author filter.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            return page <= totalPages ? (
              <button
                key={page}
                className={`px-3 py-2 rounded transition-colors ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ) : null;
          })}

          {currentPage + 2 < totalPages && (
            <span className="px-2 text-gray-500">...</span>
          )}

          {currentPage + 2 < totalPages && (
            <button
              className={`px-3 py-2 rounded transition-colors ${
                currentPage === totalPages
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            View All Books
          </button>
          <button
            onClick={() => (window.location.href = "/borrowed")}
            className="px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
          >
            View My Borrowed Books ({borrowedBookIds.length})
          </button>
          <button
            onClick={() => (window.location.href = "/favorites")}
            className="px-4 py-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors"
          >
            View My Favorites ({favoriteBookIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewBorrow;

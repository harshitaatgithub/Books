import React, { useState, useEffect } from "react";
import booksRaw from "../data/books.json";
import { getUserFromToken } from "../utils/auth";
import type { Book } from "../types";
import { FaBook, FaCalendarAlt, FaUndo } from "react-icons/fa";

const BorrowedBooks: React.FC = () => {
  const user = getUserFromToken();
  const [borrowedBookIds, setBorrowedBookIds] = useState<number[]>([]);

  // Initialize borrowed books from localStorage
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
    }
  }, [user]);

  // Convert raw books to Book type
  const books: Book[] = booksRaw.map((book) => ({
    ...book,
    isFavorite: false,
  }));

  // Get books borrowed by current user
  const currentUserBorrowedBooks = books.filter((book) =>
    borrowedBookIds.includes(book.id)
  );

  const extendBorrowing = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      const now = new Date();
      const extendedDate = new Date();
      extendedDate.setDate(extendedDate.getDate() + 14); // Extend by 2 weeks

      alert(
        `"${
          book.title
        }" borrowing period has been extended until ${extendedDate.toLocaleDateString()}`
      );
    }
  };

  const returnBook = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book && user) {
      // Remove from borrowed books
      const updatedBorrowed = borrowedBookIds.filter((id) => id !== bookId);
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
        }" has been returned successfully on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`
      );
    }
  };

  const getDueDate = (bookId: number) => {
    // Simulate a due date (14 days from today for demo purposes)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate.toLocaleDateString();
  };

  const isOverdue = (bookId: number) => {
    // Simulate overdue check (for demo, randomly mark some as overdue)
    return bookId % 7 === 0; // Every 7th book is "overdue"
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          My Borrowed Books
        </h1>
        <p className="text-gray-600">
          Manage your borrowed books and track due dates
        </p>
      </div>

      {user ? (
        <>
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <FaBook size={32} className="mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {currentUserBorrowedBooks.length}
              </p>
              <p className="text-gray-600">Currently Borrowed</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <FaCalendarAlt
                size={32}
                className="mx-auto text-green-500 mb-2"
              />
              <p className="text-2xl font-bold text-gray-800">
                {
                  currentUserBorrowedBooks.filter((book) => !isOverdue(book.id))
                    .length
                }
              </p>
              <p className="text-gray-600">On Time</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <FaUndo size={32} className="mx-auto text-red-500 mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {
                  currentUserBorrowedBooks.filter((book) => isOverdue(book.id))
                    .length
                }
              </p>
              <p className="text-gray-600">Overdue</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Books you have borrowed ({currentUserBorrowedBooks.length})
          </h2>

          {currentUserBorrowedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUserBorrowedBooks.map((book) => {
                const overdue = isOverdue(book.id);
                const dueDate = getDueDate(book.id);

                return (
                  <div
                    key={book.id}
                    className={`bg-white shadow-md rounded-lg overflow-hidden flex ${
                      overdue
                        ? "border-l-4 border-red-500"
                        : "border-l-4 border-blue-500"
                    }`}
                  >
                    <div className="w-20">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            by {book.author}
                          </p>

                          <div className="flex items-center text-sm mb-3">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            <span
                              className={
                                overdue
                                  ? "text-red-600 font-semibold"
                                  : "text-gray-600"
                              }
                            >
                              Due: {dueDate}
                            </span>
                            {overdue && (
                              <div className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                                OVERDUE
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => extendBorrowing(book.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition-colors text-sm font-semibold"
                          >
                            Extend
                          </button>
                          <button
                            onClick={() => returnBook(book.id)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors text-sm font-semibold"
                          >
                            Return
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaBook size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                You haven't borrowed any books yet.
              </p>
              <p className="text-gray-400 text-sm mt-2 mb-4">
                Visit the library to find your next great read!
              </p>
              <button
                onClick={() => (window.location.href = "/library")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors font-semibold"
              >
                Browse Books
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Please log in to see your borrowed books.
          </p>
        </div>
      )}

      {/* Borrowing Guidelines */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          📚 Borrowing Guidelines
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Books can be borrowed for up to 14 days</li>
          <li>You can extend borrowing period once before the due date</li>
          <li>Return books on time to avoid late fees</li>
          <li>Maximum of 5 books can be borrowed at once</li>
          <li>Overdue books cannot be renewed</li>
        </ul>
      </div>
    </div>
  );
};

export default BorrowedBooks;

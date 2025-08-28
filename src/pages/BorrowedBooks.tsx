import React from "react";
import { FaBook, FaCalendarAlt, FaUndo } from "react-icons/fa";
import { getUserFromToken } from "../utils/auth";
import { useBooks } from "../hooks/useBooks";
import { useModal } from "../hooks/useModal";
import Modal from "../components/Modal";
import type { Book } from "../types";

const BorrowedBooks: React.FC = () => {
  const user = getUserFromToken();
  const { books, borrowedBookIds, returnBook } = useBooks(user?.id || null);
  const { modalState, showModal, closeModal } = useModal();

  const currentUserBorrowedBooks = books.filter((book) =>
    borrowedBookIds.includes(book.id)
  );

  const handleReturnBook = (bookId: number, bookTitle: string) => {
    showModal(
      `Are you sure you want to return "${bookTitle}"?`,
      "info",
      "Return Book",
      () => {
        const success = returnBook(bookId);
        if (success) {
          showModal(
            `"${bookTitle}" has been returned successfully!`,
            "success"
          );
        }
      }
    );
  };

  const handleExtendBorrowing = (bookTitle: string) => {
    const extendedDate = new Date();
    extendedDate.setDate(extendedDate.getDate() + 14);
    showModal(
      `"${bookTitle}" borrowing period has been extended until ${extendedDate.toLocaleDateString()}`,
      "success",
      "Extended Successfully"
    );
  };

  const getDueDate = () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate.toLocaleDateString();
  };

  const isOverdue = (bookId: number) => bookId % 7 === 0;

  return (
    <div className="p-6">
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          My Borrowed Books
        </h1>
        <p className="text-gray-600">
          Manage your borrowed books and track due dates
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <FaBook size={32} className="mx-auto text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {currentUserBorrowedBooks.length}
          </p>
          <p className="text-gray-600">Currently Borrowed</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <FaCalendarAlt size={32} className="mx-auto text-green-500 mb-2" />
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

      {currentUserBorrowedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentUserBorrowedBooks.map((book: Book) => {
            const overdue = isOverdue(book.id);
            const dueDate = getDueDate();

            return (
              <div
                key={book.id}
                className={`bg-white shadow-md rounded-lg overflow-hidden ${
                  overdue
                    ? "border-l-4 border-red-500"
                    : "border-l-4 border-blue-500"
                }`}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                  <div className="flex items-center text-sm mb-3">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    <span
                      className={
                        overdue ? "text-red-600 font-semibold" : "text-gray-600"
                      }
                    >
                      Due: {dueDate}
                    </span>
                    {overdue && (
                      <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                        OVERDUE
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExtendBorrowing(book.title)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition-colors text-sm font-semibold"
                    >
                      Extend
                    </button>
                    <button
                      onClick={() => handleReturnBook(book.id, book.title)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors text-sm font-semibold"
                    >
                      Return
                    </button>
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
          <button
            onClick={() => (window.location.href = "#/library")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors font-semibold"
          >
            Browse Books
          </button>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;

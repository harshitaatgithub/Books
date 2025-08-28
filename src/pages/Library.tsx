import React, { useState } from "react";
import { FaHeart, FaCheck } from "react-icons/fa";
import { getUserFromToken } from "../utils/auth";
import { useBooks } from "../hooks/useBooks";
import { useModal } from "../hooks/useModal";
import Modal from "../components/Modal";
import type { Book } from "../types";

interface LibraryProps {
  searchQuery: string;
  selectedAuthor: string;
}

const Library: React.FC<LibraryProps> = ({ searchQuery, selectedAuthor }) => {
  const user = getUserFromToken();
  const {
    books,
    favoriteBookIds,
    borrowedBookIds,
    toggleFavorite,
    borrowBook,
  } = useBooks(user?.id || null);
  const { modalState, showModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  const handleBorrowBook = (book: Book) => {
    const result = borrowBook(book.id);
    if (result.success) {
      showModal(
        `You borrowed "${book.title}" successfully!`,
        "success",
        "Book Borrowed"
      );
    } else {
      showModal(result.message, "error", "Cannot Borrow");
    }
  };

  const handleToggleFavorite = (bookId: number) => {
    const success = toggleFavorite(bookId);
    if (success) {
      const isFavorited = favoriteBookIds.includes(bookId);
      if (!isFavorited) {
        showModal("Book added to favorites!", "success");
      }
    }
  };

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
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentBooks.map((book: Book) => {
          const isAlreadyBorrowed = borrowedBookIds.includes(book.id);
          const isFavorited = favoriteBookIds.includes(book.id);

          return (
            <div
              key={book.id}
              className={`bg-white shadow-lg rounded-lg overflow-hidden relative transition-transform hover:scale-105 ${
                isAlreadyBorrowed
                  ? "border-l-4 border-green-500"
                  : "border-l-4 border-gray-200"
              }`}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleToggleFavorite(book.id)}
                  className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                >
                  <FaHeart color={isFavorited ? "red" : "gray"} size={16} />
                </button>
                {isAlreadyBorrowed && (
                  <div className="bg-green-500 rounded-full p-2 shadow-md">
                    <FaCheck color="white" size={16} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {book.description}
                </p>
                <p className="text-right text-xs text-gray-500 mb-4">
                  — {book.author}
                </p>
                <div className="flex justify-center">
                  {!isAlreadyBorrowed ? (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full transition-colors font-semibold"
                      onClick={() => handleBorrowBook(book)}
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

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Library;

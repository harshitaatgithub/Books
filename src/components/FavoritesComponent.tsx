import React from "react";
import { FaHeart } from "react-icons/fa";
import Modal from "./Modal";
import type { Book } from "../types";

interface FavoritesComponentProps {
  modalState: any;
  closeModal: () => void;
  currentUserFavoriteBooks: Book[];
  handleBorrowBook: (book: Book) => void;
  handleRemoveFavorite: (bookId: number, bookTitle: string) => void;
}

const FavoritesComponent: React.FC<FavoritesComponentProps> = ({
  modalState,
  closeModal,
  currentUserFavoriteBooks,
  handleBorrowBook,
  handleRemoveFavorite,
}) => {
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
          My Favorite Books
        </h1>
      </div>

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
                <p className="text-gray-600 text-xs mb-2">by {book.author}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleBorrowBook(book)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    Borrow
                  </button>
                  <button
                    onClick={() => handleRemoveFavorite(book.id, book.title)}
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
        </div>
      )}

      {/* Statistics */}
      <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Your Favorites Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <FaHeart size={32} className="mx-auto text-pink-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {currentUserFavoriteBooks.length}
            </p>
            <p className="text-gray-600">Total Favorites</p>
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
    </div>
  );
};

export default FavoritesComponent;

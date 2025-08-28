import React from "react";
import { getUserFromToken } from "../utils/auth";
import { useBooks } from "../hooks/useBooks";
import { useModal } from "../hooks/useModal";
import FavoritesComponent from "../components/FavoritesComponent.tsx";
import type { Book } from "../types";

const Favorites: React.FC = () => {
  const user = getUserFromToken();
  const { books, favoriteBookIds, borrowBook, removeFavorite } = useBooks(
    user?.id || null
  );
  const { modalState, showModal, closeModal } = useModal();

  const currentUserFavoriteBooks = books.filter((book) =>
    favoriteBookIds.includes(book.id)
  );

  const handleBorrowBook = (book: Book) => {
    const result = borrowBook(book.id);
    if (result.success) {
      showModal(`"${book.title}" has been borrowed successfully!`, "success");
    } else {
      showModal(result.message, "error");
    }
  };

  const handleRemoveFavorite = (bookId: number, bookTitle: string) => {
    showModal(
      `Are you sure you want to remove "${bookTitle}" from favorites?`,
      "info",
      "Remove from Favorites",
      () => {
        const success = removeFavorite(bookId);
        if (success) {
          showModal(
            `"${bookTitle}" has been removed from your favorites.`,
            "success"
          );
        }
      }
    );
  };

  return (
    <FavoritesComponent
      modalState={modalState}
      closeModal={closeModal}
      currentUserFavoriteBooks={currentUserFavoriteBooks}
      handleBorrowBook={handleBorrowBook}
      handleRemoveFavorite={handleRemoveFavorite}
    />
  );
};

export default Favorites;

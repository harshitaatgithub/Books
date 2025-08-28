import React, { useState } from "react";
import { getUserFromToken } from "../utils/auth";
import { useBooks } from "../hooks/useBooks";
import { useModal } from "../hooks/useModal";
import LibraryComponent from "../components/LibraryComponent.tsx";
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
    <LibraryComponent
      modalState={modalState}
      closeModal={closeModal}
      currentBooks={currentBooks}
      favoriteBookIds={favoriteBookIds}
      borrowedBookIds={borrowedBookIds}
      handleBorrowBook={handleBorrowBook}
      handleToggleFavorite={handleToggleFavorite}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  );
};

export default Library;

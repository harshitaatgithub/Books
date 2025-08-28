import React from "react";
import { getUserFromToken } from "../utils/auth";
import { useBooks } from "../hooks/useBooks";
import { useModal } from "../hooks/useModal";
import BorrowedBooksComponent from "../components/BorrowedBooksComponent.tsx";

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
    <BorrowedBooksComponent
      modalState={modalState}
      closeModal={closeModal}
      currentUserBorrowedBooks={currentUserBorrowedBooks}
      handleReturnBook={handleReturnBook}
      handleExtendBorrowing={handleExtendBorrowing}
      getDueDate={getDueDate}
      isOverdue={isOverdue}
    />
  );
};

export default BorrowedBooks;

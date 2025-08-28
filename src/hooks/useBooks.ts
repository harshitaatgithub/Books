import { useState, useEffect } from "react";
import booksRaw from "../data/books.json";
import type { Book } from "../types";

export const useBooks = (userId: number | null) => {
  const [favoriteBookIds, setFavoriteBookIds] = useState<number[]>([]);
  const [borrowedBookIds, setBorrowedBookIds] = useState<number[]>([]);

  useEffect(() => {
    if (userId) {
      // Load favorites
      const storedFavorites = localStorage.getItem(`favorites_${userId}`);
      if (storedFavorites) {
        setFavoriteBookIds(JSON.parse(storedFavorites));
      } else {
        const initialFavorites = booksRaw
          .filter((book) => book.favorited_by.includes(userId))
          .map((book) => book.id);
        setFavoriteBookIds(initialFavorites);
        localStorage.setItem(
          `favorites_${userId}`,
          JSON.stringify(initialFavorites)
        );
      }

      // Load borrowed books
      const storedBorrowed = localStorage.getItem(`borrowed_${userId}`);
      if (storedBorrowed) {
        setBorrowedBookIds(JSON.parse(storedBorrowed));
      } else {
        const initialBorrowed = booksRaw
          .filter((book) => book.borrowed_by.includes(userId))
          .map((book) => book.id);
        setBorrowedBookIds(initialBorrowed);
        localStorage.setItem(
          `borrowed_${userId}`,
          JSON.stringify(initialBorrowed)
        );
      }
    }
  }, [userId]);

  const toggleFavorite = (bookId: number) => {
    if (!userId) return false;

    let updatedFavorites;
    if (favoriteBookIds.includes(bookId)) {
      updatedFavorites = favoriteBookIds.filter((id) => id !== bookId);
    } else {
      updatedFavorites = [...favoriteBookIds, bookId];
    }

    setFavoriteBookIds(updatedFavorites);
    localStorage.setItem(
      `favorites_${userId}`,
      JSON.stringify(updatedFavorites)
    );
    return true;
  };

  const borrowBook = (bookId: number) => {
    if (!userId)
      return { success: false, message: "Please log in to borrow books." };

    if (borrowedBookIds.includes(bookId)) {
      return {
        success: false,
        message: "You have already borrowed this book!",
      };
    }

    const updatedBorrowed = [...borrowedBookIds, bookId];
    setBorrowedBookIds(updatedBorrowed);
    localStorage.setItem(`borrowed_${userId}`, JSON.stringify(updatedBorrowed));

    return { success: true, message: "Book borrowed successfully!" };
  };

  const returnBook = (bookId: number) => {
    if (!userId) return false;

    const updatedBorrowed = borrowedBookIds.filter((id) => id !== bookId);
    setBorrowedBookIds(updatedBorrowed);
    localStorage.setItem(`borrowed_${userId}`, JSON.stringify(updatedBorrowed));
    return true;
  };

  const removeFavorite = (bookId: number) => {
    if (!userId) return false;

    const updatedFavorites = favoriteBookIds.filter((id) => id !== bookId);
    setFavoriteBookIds(updatedFavorites);
    localStorage.setItem(
      `favorites_${userId}`,
      JSON.stringify(updatedFavorites)
    );
    return true;
  };

  const books: Book[] = booksRaw.map((book) => ({
    ...book,
    isFavorite: favoriteBookIds.includes(book.id),
  }));

  return {
    books,
    favoriteBookIds,
    borrowedBookIds,
    toggleFavorite,
    borrowBook,
    returnBook,
    removeFavorite,
  };
};

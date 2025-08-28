import React, { useState } from "react";
import booksRaw from "../data/books.json";
import usersRaw from "../data/users.json";
import { getUserFromToken } from "../utils/auth";
import AdminPanelComponent from "../components/AdminPanelComponent.tsx";

const AdminPanel: React.FC = () => {
  const user = getUserFromToken();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  if (user?.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-500">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  const filteredBooks = booksRaw.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  const getBorrowedByUsers = (borrowedIds: number[]) => {
    return borrowedIds
      .map((id) => {
        const user = usersRaw.find((u) => u.id === id);
        return user?.username || `User ${id}`;
      })
      .join(", ");
  };

  return (
    <AdminPanelComponent
      booksRaw={booksRaw}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      startIndex={startIndex}
      currentBooks={currentBooks}
      filteredBooks={filteredBooks}
      booksPerPage={booksPerPage}
      getBorrowedByUsers={getBorrowedByUsers}
    />
  );
};

export default AdminPanel;

import React, { useState } from "react";
import type { User } from "../types";
import usersRaw from "../data/users.json";
import { getUserFromToken } from "../utils/auth";
import UsersInfoComponent from "../components/UsersInfoComponent";

const UsersInfo: React.FC = () => {
  const user = getUserFromToken();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  if (!user || user.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-500">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  const users = usersRaw as User[];
  const regularUsers = users.filter(
    (userData: User) => userData.role === "user"
  );

  const filteredUsers = regularUsers.filter((user: User) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <UsersInfoComponent
      regularUsers={regularUsers}
      filteredUsers={filteredUsers}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
    />
  );
};

export default UsersInfo;

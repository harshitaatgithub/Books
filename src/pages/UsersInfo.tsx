import React, { useState } from "react";
import type { User } from "../types";
import usersRaw from "../data/users.json";
import { getUserFromToken } from "../utils/auth";
import {
  FaUsers,
  FaSearch,
  FaUserGraduate,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const UsersInfo: React.FC = () => {
  const user = getUserFromToken();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Check if user is admin
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

  // Type assertion for users with status
  const users = usersRaw as User[];

  // Filter out admin users
  const regularUsers = users.filter(
    (userData: User) => userData.role === "user"
  );

  // Apply search and status filters
  const filteredUsers = regularUsers.filter((user: User) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Users Information
        </h1>
        <p className="text-gray-600">
          View and manage user accounts in the library system
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <FaUsers size={32} className="mx-auto text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {regularUsers.length}
          </p>
          <p className="text-gray-600 text-sm">Total Users</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <FaCheckCircle size={32} className="mx-auto text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {regularUsers.filter((u: User) => u.status === "active").length}
          </p>
          <p className="text-gray-600 text-sm">Active Users</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <FaTimesCircle size={32} className="mx-auto text-red-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {regularUsers.filter((u: User) => u.status === "inactive").length}
          </p>
          <p className="text-gray-600 text-sm">Inactive Users</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <FaUserGraduate size={32} className="mx-auto text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {filteredUsers.length}
          </p>
          <p className="text-gray-600 text-sm">Filtered Results</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "all" | "active" | "inactive")
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Users List ({filteredUsers.length})
          </h2>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: User, index: number) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUserGraduate
                              className="text-blue-600"
                              size={16}
                            />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-400 mr-2" size={14} />
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === "active" ? (
                          <>
                            <FaCheckCircle className="mr-1" size={10} />
                            Active
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="mr-1" size={10} />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUsers size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery || filterStatus !== "all"
                ? "No users found matching your criteria."
                : "No users found."}
            </p>
            {(searchQuery || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                }}
                className="mt-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Information */}
      <div className="mt-6 bg-yellow-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">📊 Summary</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Total registered users: <strong>{regularUsers.length}</strong>
          </li>
          <li>
            • Active users:{" "}
            <strong>
              {regularUsers.filter((u: User) => u.status === "active").length}
            </strong>
          </li>
          <li>
            • Inactive users:{" "}
            <strong>
              {regularUsers.filter((u: User) => u.status === "inactive").length}
            </strong>
          </li>
          <li>
            • Last updated: <strong>{new Date().toLocaleDateString()}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UsersInfo;

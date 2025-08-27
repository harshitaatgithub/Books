import React, { useState } from "react";
import type { User } from "../types";
import usersRaw from "../data/users.json";
import { getUserFromToken } from "../utils/auth";
import { FaUsers, FaSearch, FaUserGraduate, FaEnvelope } from "react-icons/fa";

const StudentsInfo: React.FC = () => {
  const user = getUserFromToken();
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is admin
  if (!user || !user.username.startsWith("admin")) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-500">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  // Filter out admin users and get only regular users (students)
  const students = usersRaw.filter(
    (userData: User) =>
      userData.role === "user" && !userData.username.startsWith("admin")
  );

  // Apply search filter
  const filteredStudents = students.filter(
    (student: User) =>
      student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Students Information
        </h1>
        <p className="text-gray-600">
          View and manage student accounts in the library system
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <FaUsers size={32} className="mx-auto text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{students.length}</p>
          <p className="text-gray-600 text-sm">Total Students</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <FaUserGraduate size={32} className="mx-auto text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {filteredStudents.length}
          </p>
          <p className="text-gray-600 text-sm">Filtered Results</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <FaEnvelope size={32} className="mx-auto text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {new Set(students.map((s: User) => s.email.split("@")[1])).size}
          </p>
          <p className="text-gray-600 text-sm">Email Domains</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Students List ({filteredStudents.length})
          </h2>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
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
                {filteredStudents.map((student: User, index: number) => (
                  <tr
                    key={student.id}
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
                            {student.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {student.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-400 mr-2" size={14} />
                        <div className="text-sm text-gray-900">
                          {student.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
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
              {searchQuery
                ? "No students found matching your search."
                : "No students found."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Additional Admin Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Admin Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                "Name,Email\n" +
                filteredStudents
                  .map((s: User) => `${s.username},${s.email}`)
                  .join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "students_list.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Export to CSV
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                filteredStudents.map((s: User) => s.email).join(", ")
              );
              alert("Email addresses copied to clipboard!");
            }}
            className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            Copy Email Addresses
          </button>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Summary Information */}
      <div className="mt-6 bg-yellow-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">📊 Summary</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Total registered students: <strong>{students.length}</strong>
          </li>
          <li>
            • Currently displayed: <strong>{filteredStudents.length}</strong>
          </li>
          <li>
            • Unique email domains:{" "}
            <strong>
              {new Set(students.map((s: User) => s.email.split("@")[1])).size}
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

export default StudentsInfo;

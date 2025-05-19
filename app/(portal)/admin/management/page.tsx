"use client";

import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { extractDateString, getImageUrlFromPublicId } from "@/lib/utils";
import { UserFromAPI } from "@/lib/types/user.types";
import { PaginatedApiResponse } from "@/lib/types/apiResponse.types";
import Image from "next/image";

// Define column type
type ColumnDef = {
  header: string;
  render: (
    user: UserFromAPI,
    onDelete: (id: string) => void
  ) => React.ReactNode;
};

// UserList Component
const UserList = ({
  userType,
  columns,
}: {
  userType: "clients" | "vendors";
  columns: ColumnDef[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserFromAPI[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const apiUrl =
    userType === "clients" ? "/api/users/clients" : "/api/users/vendors";
  const pageSize = 10;

  // Fetch data when page changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}?page=${currentPage}&pageSize=${pageSize}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data: PaginatedApiResponse<UserFromAPI[]> = await response.json();
        if (data.error) throw new Error(data.error);
        setUsers(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      } catch (err) {
        setError((err as Error).message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, apiUrl]);

  // Handle delete button click
  const handleDelete = (id: string) => {
    setUserToDelete(id);
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/users/${userToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      // Refetch data after deletion
      const response = await fetch(
        `${apiUrl}?page=${currentPage}&pageSize=${pageSize}`
      );
      const data: PaginatedApiResponse<UserFromAPI[]> = await response.json();
      setUsers(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (err) {
      setError((err as Error).message || "Deletion failed");
    } finally {
      setUserToDelete(null);
    }
  };

  // Loading and error states
  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {/* Non-functional search and sort UI */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border p-2 rounded"
          disabled
        />
        <select className="border p-2 rounded" disabled>
          <option>Sort by registration date</option>
          <option>Sort by name</option>
        </select>
      </div>

      {/* User table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th key={col.header} className="py-2 px-4 border-b text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.header} className="py-2 px-4 border-b">
                  {col.render(user, handleDelete)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Deletion confirmation modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// UserManagementPage Component
export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<"clients" | "vendors">("clients");

  // Column definitions for clients
  const clientColumns: ColumnDef[] = [
    {
      header: "Photo",
      render: (user) =>
        user.imagePublicId ? (
          <Image
            width={40}
            height={40}
            src={getImageUrlFromPublicId(user.imagePublicId)}
            alt={user.nom}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <FaUser className="text-gray-500" />
          </div>
        ),
    },
    {
      header: "Name",
      render: (user) => `${user.prenom} ${user.nom}`,
    },
    {
      header: "Email",
      render: (user) => user.email,
    },
    {
      header: "Registration Date",
      render: (user) => extractDateString(user.dateCreation),
    },
    {
      header: "Total Spent",
      render: () => "----",
    },
    {
      header: "Orders",
      render: () => "----",
    },
    {
      header: "Actions",
      render: (user, onDelete) => (
        <button
          onClick={() => onDelete(user.id)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  // Column definitions for vendors
  const vendorColumns: ColumnDef[] = [
    {
      header: "Photo",
      render: (user) =>
        user.imagePublicId ? (
          <Image
            height={40}
            width={40}
            src={getImageUrlFromPublicId(user.imagePublicId)}
            alt={user.nom}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <FaUser className="text-gray-500" />
          </div>
        ),
    },
    {
      header: "Name",
      render: (user) => `${user.prenom} ${user.nom}`,
    },
    {
      header: "Email",
      render: (user) => user.email,
    },
    {
      header: "Shop Name",
      render: (user) => user.vendeur?.nomBoutique || "N/A",
    },
    {
      header: "Bank",
      render: (user) => user.vendeur?.nomBanque || "N/A",
    },
    {
      header: "RIB",
      render: (user) => user.vendeur?.rib || "N/A",
    },
    {
      header: "Rating",
      render: () => "----",
    },
    {
      header: "Actions",
      render: (user, onDelete) => (
        <button
          onClick={() => onDelete(user.id)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tab switcher */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "clients" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("clients")}
        >
          Clients
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "vendors" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("vendors")}
        >
          Vendors
        </button>
      </div>

      {/* Render UserList based on active tab */}
      <UserList
        userType={activeTab}
        columns={activeTab === "clients" ? clientColumns : vendorColumns}
      />
    </div>
  );
}

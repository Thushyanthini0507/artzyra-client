"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/services/adminService";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from backend - backend requires role parameter
  // So we fetch both artists and customers separately
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔵 Admin Users Page - Fetching all users (artists + customers)...");
      
      // Fetch both roles in parallel
      const [artistsResponse, customersResponse] = await Promise.allSettled([
        adminService.getUsers("artist"),
        adminService.getUsers("customer"),
      ]);

      const allUsers: User[] = [];

      // Process artists
      if (artistsResponse.status === "fulfilled") {
        const result = artistsResponse.value;
        if (result.success && result.data && Array.isArray(result.data)) {
          allUsers.push(...result.data.map((user: any) => ({ ...user, role: user.role || "artist" })));
        } else if (result.error && !result.error.includes("schema") && !result.error.includes("populate")) {
          // Only show error if it's not a schema error (those are handled silently)
          console.warn("🔵 Admin Users Page - Could not fetch artists:", result.error);
        }
      }

      // Process customers
      if (customersResponse.status === "fulfilled") {
        const result = customersResponse.value;
        if (result.success && result.data && Array.isArray(result.data)) {
          allUsers.push(...result.data.map((user: any) => ({ ...user, role: user.role || "customer" })));
        } else if (result.error && !result.error.includes("schema") && !result.error.includes("populate")) {
          // Only show error if it's not a schema error (those are handled silently)
          console.warn("🔵 Admin Users Page - Could not fetch customers:", result.error);
        }
      }

      // Check if we got any users
      if (allUsers.length === 0) {
        // If both failed, check if it was due to schema errors
        const artistsError = artistsResponse.status === "fulfilled" ? artistsResponse.value.error : null;
        const customersError = customersResponse.status === "fulfilled" ? customersResponse.value.error : null;
        
        const hasSchemaError = 
          (artistsError && (artistsError.includes("schema") || artistsError.includes("populate"))) ||
          (customersError && (customersError.includes("schema") || customersError.includes("populate")));

        if (hasSchemaError) {
          setError("Backend schema error: Cannot fetch users. Please check backend logs.");
          toast.error("Backend schema error: Cannot fetch users");
        } else {
          setUsers([]);
        }
      } else {
        console.log("🔵 Admin Users Page - Setting users:", allUsers.length);
        setUsers(allUsers);
      }
    } catch (err: any) {
      console.error("🔴 Admin Users Page - Error fetching users:", err);
      const errorMsg = 
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch users";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error loading users:</p>
          <p>{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border text-left">Name</th>
                <th className="p-2 border text-left">Email</th>
                <th className="p-2 border text-left">Role</th>
                <th className="p-2 border text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{user.name || "N/A"}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border capitalize">{user.role || "N/A"}</td>
                  <td className="p-2 border capitalize">{user.status || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

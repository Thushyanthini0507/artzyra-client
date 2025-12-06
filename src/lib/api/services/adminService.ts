import api from "../apiClient";

export interface DashboardStats {
  totalCustomers: number;
  totalArtists: number;
  pendingArtists: number;
  totalBookings: number;
  pendingBookings: number;
}

export const adminService = {
  // Dashboard
  getDashboardStatus: async () => {
    try {
      const response = await api.get("/api/admin/dashboard/status");
      // Backend returns { success: true, data: { stats: {...} } }
      const responseData = response.data;

      if (
        responseData.success &&
        responseData.data &&
        responseData.data.stats
      ) {
        return { success: true, data: responseData.data.stats };
      }

      if (responseData.success !== undefined) {
        return responseData; // Already has { success, data } structure
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      // Don't log network errors - they're already handled by axios interceptor
      // Only log unexpected errors (not network/connection errors)
      if (
        error.code !== "ERR_NETWORK" &&
        error.code !== "ECONNREFUSED" &&
        !error.message?.includes("Network Error")
      ) {
        console.error("getDashboardStatus error:", error);
      }
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      // Return failure silently for network errors - backend is likely down
      return { success: false, error: null, data: null };
    }
  },

  // Users
  getUsers: async (role?: string) => {
    try {
      const query = role ? `?role=${role}` : "";
      const response = await api.get(`/api/admin/users${query}`);
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      // Don't log errors for this endpoint - it has backend schema issues
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || "";

      // Check for schema errors (500 with populate/schema/category message)
      const isSchemaError =
        status === 500 &&
        (errorMessage.includes("populate") ||
          errorMessage.includes("schema") ||
          errorMessage.includes("category"));

      // Check for missing role error (400)
      const isMissingRoleError =
        status === 400 &&
        (errorMessage.includes("role") ||
          errorMessage.includes("Please specify"));

      if (status === 401) {
        throw new Error("Unauthorized: Please login again");
      }

      // Return failure silently for all known issues (400, 404, 500)
      if (status === 400 || status === 404 || status === 500) {
        return { success: false, error: null, data: [] };
      }

      // Only log truly unexpected errors
      console.error("getUsers error:", error);

      return { success: false, error: null, data: [] };
    }
  },

  // Artists
  getPendingArtists: async () => {
    try {
      console.log("🔵 Admin Service - Fetching pending artists...");

      // Strategy 1: Try the specific pending artists endpoint
      try {
        console.log(
          "🔵 Admin Service - Strategy 1: Trying /api/admin/pending/artists"
        );
        const response = await api.get("/api/admin/pending/artists");
        if (response.data.success) {
          const data = Array.isArray(response.data.data)
            ? response.data.data
            : [];
          // Only return if we actually found pending artists, otherwise try next strategy
          if (data.length > 0) {
            console.log(
              `🔵 Admin Service - Strategy 1 success: Found ${data.length} artists`
            );
            return { success: true, data };
          }
          console.log(
            "🔵 Admin Service - Strategy 1 returned empty list, trying next strategy..."
          );
        }
      } catch (err: any) {
        console.log(`🔵 Admin Service - Strategy 1 failed: ${err.message}`);
      }

      // Strategy 2: Try alternative endpoint (artists routes)
      try {
        console.log(
          "🔵 Admin Service - Strategy 2: Trying /api/artists/pending"
        );
        const response = await api.get("/api/artists/pending");
        if (response.data.success) {
          const data = Array.isArray(response.data.data)
            ? response.data.data
            : [];
          if (data.length > 0) {
            console.log(
              `🔵 Admin Service - Strategy 2 success: Found ${data.length} artists`
            );
            return { success: true, data };
          }
          console.log(
            "🔵 Admin Service - Strategy 2 returned empty list, trying next strategy..."
          );
        }
      } catch (err: any) {
        console.log(`🔵 Admin Service - Strategy 2 failed: ${err.message}`);
      }

      // Strategy 3: Get ALL artists and filter client-side (Most robust)
      try {
        console.log(
          "🔵 Admin Service - Strategy 3: Fetching ALL artists to filter manually"
        );
        // Try to get all users with role=artist
        const response = await api.get("/api/admin/users?role=artist");
        const responseData = response.data;

        let allArtists: any[] = [];
        if (responseData.success && Array.isArray(responseData.data)) {
          allArtists = responseData.data;
        } else if (Array.isArray(responseData)) {
          allArtists = responseData;
        }

        console.log(
          `🔵 Admin Service - Strategy 3: Got ${allArtists.length} total artists. Filtering...`
        );

        // Log a sample artist to see structure
        if (allArtists.length > 0) {
          console.log(
            "🔵 Admin Service - Sample artist structure:",
            JSON.stringify(allArtists[0], null, 2)
          );
        }

        const pendingArtists = allArtists.filter((artist: any) => {
          // Check various ways status might be stored
          const status = (artist.status || "").toLowerCase();
          const isPending =
            status === "pending" ||
            status === "pending approval" ||
            status === "submitted" ||
            // If status is missing but they are an artist, they might be pending
            (!status && artist.role === "artist");

          return isPending;
        });

        console.log(
          `🔵 Admin Service - Strategy 3 success: Filtered down to ${pendingArtists.length} pending artists`
        );
        return { success: true, data: pendingArtists };
      } catch (err: any) {
        console.log(`🔵 Admin Service - Strategy 3 failed: ${err.message}`);
      }

      // If all strategies fail
      console.warn(
        "🔵 Admin Service - All strategies failed to fetch pending artists"
      );
      return { success: true, data: [] }; // Return empty array to avoid UI crash
    } catch (error: any) {
      console.error("🔴 Admin Service - getPendingArtists fatal error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return {
        success: false,
        error: error.message || "Failed to fetch pending artists",
      };
    }
  },

  approveArtist: async (artistId: string) => {
    try {
      console.log("🔵 Admin Service - Approving artist:", artistId);

      // Strategy 1: Admin specific endpoint
      try {
        const response = await api.put(
          `/api/admin/artists/${artistId}/approve`,
          {}
        );
        if (response.data.success) return response.data;
      } catch (e) {
        console.log("Strategy 1 failed");
      }

      // Strategy 2: General user endpoint
      try {
        const response = await api.put(`/api/users/${artistId}/approve`, {});
        if (response.data.success) return response.data;
      } catch (e) {
        console.log("Strategy 2 failed");
      }

      // Strategy 3: Artist specific endpoint
      try {
        const response = await api.put(`/api/artists/${artistId}/approve`, {});
        if (response.data.success) return response.data;
      } catch (e) {
        console.log("Strategy 3 failed");
      }

      // Strategy 4: Status update endpoint
      try {
        const response = await api.put(`/api/admin/users/${artistId}`, {
          status: "approved",
        });
        if (response.data.success) return response.data;
      } catch (e) {
        console.log("Strategy 4 failed");
      }

      throw new Error("Failed to approve artist with all known endpoints");
    } catch (error: any) {
      console.error("🔴 Admin Service - approveArtist error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to approve artist";
      if (error.response?.status === 401)
        throw new Error("Unauthorized: Please login again");
      return { success: false, error: errorMessage };
    }
  },

  rejectArtist: async (artistId: string) => {
    try {
      console.log("🔵 Admin Service - Rejecting artist:", artistId);
      // Try multiple possible endpoints
      let response;
      let responseData;

      try {
        // Try admin endpoint first
        response = await api.put(`/api/admin/artists/${artistId}/reject`, {});
        responseData = response.data;
      } catch (err: any) {
        // If that fails, try the artists endpoint
        if (err.response?.status === 404) {
          console.log("🔵 Admin Service - Trying alternative endpoint...");
          response = await api.put(`/api/artists/${artistId}/reject`, {});
          responseData = response.data;
        } else {
          throw err;
        }
      }

      if (responseData.success !== undefined) {
        if (responseData.success) {
          console.log("🔵 Admin Service - Artist rejected successfully");
          return responseData;
        } else {
          return {
            success: false,
            error:
              responseData.message ||
              responseData.error ||
              "Failed to reject artist",
          };
        }
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("🔴 Admin Service - rejectArtist error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to reject artist";

      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return { success: false, error: errorMessage };
    }
  },

  // Bookings
  getBookings: async () => {
    try {
      const response = await api.get("/api/admin/bookings");
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      // Don't log errors for optional endpoint - bookings endpoint may not exist
      const status = error.response?.status;

      if (status === 401) {
        throw new Error("Unauthorized: Please login again");
      }

      // Return empty data silently for 404 (endpoint doesn't exist) or other errors
      if (status === 404 || status === 500) {
        return { success: false, error: null, data: [] };
      }

      // Only log unexpected errors (not 404, 500)
      if (status && status !== 404 && status !== 500) {
        console.error("getBookings error:", error);
      }

      return { success: false, error: null, data: [] };
    }
  },

  // Payments
  getPayments: async () => {
    try {
      const response = await api.get("/api/admin/payments");
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      // Don't log errors for optional endpoint - payments endpoint may not exist
      const status = error.response?.status;

      if (status === 401) {
        throw new Error("Unauthorized: Please login again");
      }

      // Return empty data silently for 404 (endpoint doesn't exist) or other errors
      if (status === 404 || status === 500) {
        return { success: false, error: null, data: [] };
      }

      console.error("getPayments error:", error);

      return { success: false, error: null, data: [] };
    }
  },

  refundPayment: async (paymentId: string) => {
    try {
      const response = await api.post(`/api/payments/${paymentId}/refund`, {});
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("refundPayment error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return {
        success: false,
        error: error.message || "Failed to refund payment",
      };
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const response = await api.get("/api/categories");
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("getCategories error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return {
        success: false,
        error: error.message || "Failed to fetch categories",
      };
    }
  },

  createCategory: async (data: {
    name: string;
    description?: string;
    image?: string;
  }) => {
    try {
      const response = await api.post("/api/categories", data);
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("createCategory error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return {
        success: false,
        error: error.message || "Failed to create category",
      };
    }
  },

  updateCategory: async (
    id: string,
    data: { name?: string; description?: string; image?: string }
  ) => {
    try {
      const response = await api.put(`/api/categories/${id}`, data);
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("updateCategory error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return {
        success: false,
        error: error.message || "Failed to update category",
      };
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const response = await api.delete(`/api/categories/${id}`);
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("deleteCategory error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return {
        success: false,
        error: error.message || "Failed to delete category",
      };
    }
  },
};

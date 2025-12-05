import api from "../axios";

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
      // Backend returns { success: true, data: {...} } or just the data
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData; // Already has { success, data } structure
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("getDashboardStatus error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return { success: false, error: error.message || "Failed to fetch dashboard stats" };
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
      console.error("getUsers error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return { success: false, error: error.message || "Failed to fetch users" };
    }
  },

  // Artists
  getPendingArtists: async () => {
    try {
      const response = await api.get("/api/admin/pending/artists");
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("getPendingArtists error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return { success: false, error: error.message || "Failed to fetch pending artists" };
    }
  },

  approveArtist: async (artistId: string) => {
    try {
      const response = await api.put(`/api/artists/${artistId}/approve`, {});
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("approveArtist error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return { success: false, error: error.message || "Failed to approve artist" };
    }
  },

  rejectArtist: async (artistId: string) => {
    try {
      const response = await api.put(`/api/artists/${artistId}/reject`, {});
      const responseData = response.data;
      if (responseData.success !== undefined) {
        return responseData;
      }
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error("rejectArtist error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return { success: false, error: error.message || "Failed to reject artist" };
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
      console.error("getBookings error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return { success: false, error: error.message || "Failed to fetch bookings" };
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
      console.error("getPayments error:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      return { success: false, error: error.message || "Failed to fetch payments" };
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
      return { success: false, error: error.message || "Failed to refund payment" };
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
      return { success: false, error: error.message || "Failed to fetch categories" };
    }
  },

  createCategory: async (data: { name: string; description?: string; image?: string }) => {
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
      return { success: false, error: error.message || "Failed to create category" };
    }
  },

  updateCategory: async (id: string, data: { name?: string; description?: string; image?: string }) => {
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
      return { success: false, error: error.message || "Failed to update category" };
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
      return { success: false, error: error.message || "Failed to delete category" };
    }
  },
};

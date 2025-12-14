import apiClient from "@/lib/apiClient";

export interface DashboardStats {
  totalCustomers: number;
  totalArtists: number;
  pendingArtists: number;
  totalBookings: number;
  pendingBookings: number;
}

export const adminService = {
  getDashboardStatus: async () => {
    const response = await apiClient.get("/admin/dashboard/status");
    return response.data;
  },
  getAnalytics: async (period: string = "30d") => {
    const response = await apiClient.get("/admin/analytics", {
      params: { period },
    });
    return response.data;
  },
  getUsers: async (role?: string) => {
    const params = role ? { role } : {};
    const response = await apiClient.get("/admin/users", { params });
    return response.data;
  },
  getPendingArtists: async () => {
    const response = await apiClient.get("/admin/pending/artists");
    return response.data;
  },
  approveArtist: async (artistId: string) => {
    const response = await apiClient.put(`/admin/artists/${artistId}/approve`);
    return response.data;
  },
  rejectArtist: async (artistId: string) => {
    const response = await apiClient.put(`/admin/artists/${artistId}/reject`);
    return response.data;
  },
  getBookings: async () => {
    const response = await apiClient.get("/admin/bookings");
    return response.data;
  },
  getPayments: async () => {
    const response = await apiClient.get("/admin/payments");
    return response.data;
  },
  refundPayment: async (paymentId: string) => {
    const response = await apiClient.post(`/payments/${paymentId}/refund`, {});
    return response.data;
  },
  getCategories: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) => {
    const response = await apiClient.get("/categories", { params });
    return response.data;
  },
  createCategory: async (data: {
    name: string;
    description?: string;
    image?: string;
  }) => {
    const response = await apiClient.post("/categories", data);
    return response.data;
  },
  updateCategory: async (
    id: string,
    data: { name?: string; description?: string; image?: string; type?: "physical" | "remote" }
  ) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get("/admin/profile");
    return response.data;
  },
  updateProfile: async (data: {
    name?: string;
    phone?: string;
    permissions?: string[];
    bio?: string;
    department?: string;
    position?: string;
    profileImage?: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  }) => {
    const response = await apiClient.put("/admin/profile", data);
    return response.data;
  },
};

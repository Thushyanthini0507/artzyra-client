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
    return api.get<{ data: DashboardStats }>("/api/admin/dashboard/status");
  },

  // Users
  getUsers: async (role?: string) => {
    const query = role ? `?role=${role}` : "";
    return api.get(`/api/admin/users${query}`);
  },

  // Artists
  getPendingArtists: async () => {
    return api.get("/api/admin/pending/artists");
  },

  approveArtist: async (artistId: string) => {
    return api.put(`/api/artists/${artistId}/approve`, {});
  },

  rejectArtist: async (artistId: string) => {
    return api.put(`/api/artists/${artistId}/reject`, {});
  },

  // Bookings
  getBookings: async () => {
    return api.get("/api/admin/bookings");
  },

  // Payments
  getPayments: async () => {
    return api.get("/api/admin/payments");
  },

  refundPayment: async (paymentId: string) => {
    return api.post(`/payments/${paymentId}/refund`, {});
  },

  // Categories
  getCategories: async () => {
    return api.get("/api/categories");
  },

  createCategory: async (data: { name: string; description?: string; image?: string }) => {
    return api.post("/api/categories", data);
  },

  updateCategory: async (id: string, data: { name?: string; description?: string; image?: string }) => {
    return api.put(`/api/categories/${id}`, data);
  },

  deleteCategory: async (id: string) => {
    return api.delete(`/api/categories/${id}`);
  },
};

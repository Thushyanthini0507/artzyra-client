import { nextApi } from "../../api";

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
    return nextApi.get<{ data: DashboardStats }>("/api/admin/dashboard/status");
  },

  // Users
  getUsers: async (role?: string) => {
    const query = role ? `?role=${role}` : "";
    return nextApi.get(`/api/admin/users${query}`);
  },

  // Artists
  getPendingArtists: async () => {
    return nextApi.get("/api/admin/pending/artists");
  },

  approveArtist: async (artistId: string) => {
    return nextApi.put(`/api/artists/${artistId}/approve`, {});
  },

  rejectArtist: async (artistId: string) => {
    return nextApi.put(`/api/artists/${artistId}/reject`, {});
  },

  // Bookings
  getBookings: async () => {
    return nextApi.get("/api/admin/bookings");
  },

  // Payments
  getPayments: async () => {
    return nextApi.get("/api/admin/payments");
  },

  refundPayment: async (paymentId: string) => {
    return nextApi.post(`/api/payments/${paymentId}/refund`, {});
  },

  // Categories
  getCategories: async () => {
    return nextApi.get("/api/categories");
  },

  createCategory: async (data: { name: string; description?: string; image?: string }) => {
    return nextApi.post("/api/categories", data);
  },

  updateCategory: async (id: string, data: { name?: string; description?: string; image?: string }) => {
    return nextApi.put(`/api/categories/${id}`, data);
  },

  deleteCategory: async (id: string) => {
    return nextApi.delete(`/api/categories/${id}`);
  },
};

import api from "../axios";

export const adminService = {
  getUsers: async (role?: string) => {
    const response = await api.get(`/api/admin/users${role ? `?role=${role}` : ""}`);
    return response.data;
  },
  getUserById: async (role: string, userId: string) => {
    const response = await api.get(`/api/admin/users/${role}/${userId}`);
    return response.data;
  },
  updateUserStatus: async (userId: string, status: string) => {
    const response = await api.put("/api/admin/users", { userId, status });
    return response.data;
  },
  getPendingArtists: async () => {
    const response = await api.get("/api/admin/pending/artists");
    return response.data;
  },
  getBookings: async () => {
    const response = await api.get("/api/admin/bookings");
    return response.data;
  },
  getDashboardStatus: async () => {
    const response = await api.get("/api/admin/dashboard/status");
    return response.data;
  },
  approveArtist: async (artistId: string) => {
    const response = await api.patch(`/api/artists/${artistId}/approve`);
    return response.data;
  },
  rejectArtist: async (artistId: string, reason?: string) => {
    const response = await api.patch(`/api/artists/${artistId}/reject`, { reason });
    return response.data;
  },
};

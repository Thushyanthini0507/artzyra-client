import api from "../axios";

export const artistService = {
  getAllArtists: async (params?: any) => {
    const response = await api.get("/api/artists", { params });
    return response.data;
  },
  getArtistById: async (id: string) => {
    const response = await api.get(`/api/artists/${id}`);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("/api/artists/profile");
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put("/api/artists/profile", data);
    return response.data;
  },
  getBookings: async (params?: any) => {
    const response = await api.get("/api/artists/bookings", { params });
    return response.data;
  },
  acceptBooking: async (bookingId: string) => {
    const response = await api.put(`/api/artists/bookings/${bookingId}/accept`);
    return response.data;
  },
  rejectBooking: async (bookingId: string) => {
    const response = await api.put(`/api/artists/bookings/${bookingId}/reject`);
    return response.data;
  },
  getReviews: async () => {
    const response = await api.get("/api/artists/reviews");
    return response.data;
  },
};

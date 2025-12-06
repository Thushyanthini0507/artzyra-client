import apiClient from "@/lib/apiClient";


export const artistService = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get("/artists", { params: filters });
    return response.data;
  },
  getAllArtists: async (filters?: any) => {
    const response = await apiClient.get("/artists", { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/artists/${id}`);
    return response.data;
  },
  getArtistById: async (id: string) => {
    const response = await apiClient.get(`/artists/${id}`);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get("/artists/profile");
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.put("/artists/profile", data);
    return response.data;
  },
  getBookings: async (params?: any) => {
    const response = await apiClient.get("/artists/bookings", { params });
    return response.data;
  },
  acceptBooking: async (bookingId: string) => {
    const response = await apiClient.put(`/artists/bookings/${bookingId}/accept`);
    return response.data;
  },
  rejectBooking: async (bookingId: string) => {
    const response = await apiClient.put(`/artists/bookings/${bookingId}/reject`);
    return response.data;
  },
  getReviews: async () => {
    const response = await apiClient.get("/artists/reviews");
    return response.data;
  },
};


import apiClient from "@/lib/apiClient";
import { Customer, UpdateCustomerData } from "@/types/customer";

export const customerService = {
  getProfile: async () => {
    const response = await apiClient.get("/customers/profile");
    return response.data;
  },
  updateProfile: async (data: Partial<UpdateCustomerData>) => {
    const response = await apiClient.patch("/customers/profile", data);
    return response.data;
  },
  getBookings: async () => {
    const response = await apiClient.get("/customers/bookings");
    return response.data;
  },
  getReviews: async () => {
    const response = await apiClient.get("/customers/reviews");
    return response.data;
  },
  getFavorites: async () => {
    const response = await apiClient.get("/customers/favorites");
    return response.data;
  },
  toggleFavorite: async (artistId: string) => {
    const response = await apiClient.post("/customers/favorites", { artistId });
    return response.data;
  },
};


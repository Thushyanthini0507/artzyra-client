import api from "../axios";
import { Customer } from "@/types";

export const customerService = {
  getProfile: async () => {
    const response = await api.get("/api/customers/profile");
    return response.data;
  },
  updateProfile: async (data: Partial<Customer>) => {
    const response = await api.put("/api/customers/profile", data);
    return response.data;
  },
  getBookings: async () => {
    const response = await api.get("/api/customers/bookings");
    return response.data;
  },
  getReviews: async () => {
    const response = await api.get("/api/customers/reviews");
    return response.data;
  },
};

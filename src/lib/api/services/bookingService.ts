import api from "../axios";
import { Booking } from "@/types";

export const bookingService = {
  createBooking: async (data: Partial<Booking>) => {
    const response = await api.post("/api/bookings", data);
    return response.data;
  },
  getCustomerBookings: async (params?: any) => {
    const response = await api.get("/api/customers/bookings", { params });
    return response.data;
  },
  getBookingById: async (id: string) => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  },
  // Backend endpoint might be missing, suggesting implementation
  updateBooking: async (id: string, data: Partial<Booking>) => {
    // Expected endpoint: PUT /api/bookings/:bookingId
    const response = await api.put(`/api/bookings/${id}`, data);
    return response.data;
  },
  // Backend endpoint might be missing, suggesting implementation
  deleteBooking: async (id: string) => {
    // Expected endpoint: DELETE /api/bookings/:bookingId
    const response = await api.delete(`/api/bookings/${id}`);
    return response.data;
  },
};

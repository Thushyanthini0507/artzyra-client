import api from "../apiClient";
import { Booking } from "@/types";

export const bookingService = {
  createBooking: async (data: Partial<Booking>) => {
    try {
      const response = await api.post("/api/bookings", data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      return {
        success: false,
        error:
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to create booking",
      };
    }
  },
  getCustomerBookings: async (params?: Record<string, unknown>) => {
    try {
      const response = await api.get("/api/customers/bookings", { params });
      return response.data;
    } catch (error: unknown) {
      // Silently handle errors - return empty array for bookings list
      return { success: false, data: [], error: "Failed to fetch bookings" };
    }
  },
  getBookingById: async (id: string) => {
    try {
      const response = await api.get(`/api/bookings/${id}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      return {
        success: false,
        error:
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to fetch booking",
      };
    }
  },
  updateBooking: async (id: string, data: Partial<Booking>) => {
    try {
      const response = await api.put(`/api/bookings/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      return {
        success: false,
        error:
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to update booking",
      };
    }
  },
  deleteBooking: async (id: string) => {
    try {
      const response = await api.delete(`/api/bookings/${id}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      return {
        success: false,
        error:
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to delete booking",
      };
    }
  },
};

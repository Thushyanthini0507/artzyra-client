import apiClient from "@/lib/apiClient";
import { Booking, CreateBookingData, UpdateBookingData } from "@/types/booking";

export const bookingService = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get("/bookings", { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },
  getBookingById: async (id: string) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },
  create: async (data: CreateBookingData | Partial<Booking>) => {
    const response = await apiClient.post("/bookings", data);
    return response.data;
  },
  createBooking: async (data: CreateBookingData | Partial<Booking>) => {
    const response = await apiClient.post("/bookings", data);
    return response.data;
  },
  update: async (id: string, data: Partial<UpdateBookingData>) => {
    const response = await apiClient.patch(`/bookings/${id}`, data);
    return response.data;
  },
  updateBooking: async (id: string, data: Partial<UpdateBookingData>) => {
    const response = await apiClient.patch(`/bookings/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
  },
  deleteBooking: async (id: string) => {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
  },
  getCustomerBookings: async (params?: any) => {
    const response = await apiClient.get("/customers/bookings", { params });
    return response.data;
  },
};


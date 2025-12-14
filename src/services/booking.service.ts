import apiClient from "@/lib/apiClient";
import { 
  Booking, 
  CreateBookingData, 
  UpdateBookingData,
  RevisionRequest,
  ApprovalRequest,
  CancellationRequest,
} from "@/types/booking";

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
  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/bookings/${id}/status`, { status });
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
  // New remote work booking endpoints
  requestRevision: async (id: string, data: RevisionRequest) => {
    const response = await apiClient.post(`/bookings/${id}/revision`, data);
    return response.data;
  },
  approveBooking: async (id: string, data?: ApprovalRequest) => {
    const response = await apiClient.post(`/bookings/${id}/approve`, data || {});
    return response.data;
  },
  cancelBooking: async (id: string, data?: CancellationRequest) => {
    const response = await apiClient.post(`/bookings/${id}/cancel`, data || {});
    return response.data;
  },
  approveCustomQuote: async (id: string) => {
    const response = await apiClient.post(`/bookings/${id}/approve-quote`);
    return response.data;
  },
  setCustomQuote: async (id: string, amount: number, description?: string) => {
    const response = await apiClient.post(`/bookings/${id}/set-quote`, { amount, description });
    return response.data;
  },
  checkArtistAvailability: async (artistId: string, date?: string) => {
    const response = await apiClient.get(`/bookings/check-availability/${artistId}`, {
      params: date ? { date } : {},
    });
    return response.data;
  },
  completeBooking: async (id: string) => {
    const response = await apiClient.post(`/bookings/${id}/complete`);
    return response.data;
  },
  // Admin endpoints
  getAllBookingsAdmin: async (filters?: any) => {
    const response = await apiClient.get("/bookings/admin/all", { params: filters });
    return response.data;
  },
  adminForceCancel: async (id: string, reason?: string, refundAmount?: number) => {
    const response = await apiClient.post(`/bookings/${id}/admin/cancel`, { reason, refundAmount });
    return response.data;
  },
  adminProcessRefund: async (id: string, amount: number, reason?: string) => {
    const response = await apiClient.post(`/bookings/${id}/admin/refund`, { amount, reason });
    return response.data;
  },
  adminResolveDispute: async (id: string, decision: string, refundAmount?: number, notes?: string) => {
    const response = await apiClient.post(`/bookings/${id}/admin/resolve-dispute`, {
      decision,
      refundAmount,
      notes,
    });
    return response.data;
  },
  getArtistPerformance: async (artistId: string, startDate?: string, endDate?: string) => {
    const response = await apiClient.get(`/bookings/admin/artist-performance/${artistId}`, {
      params: { startDate, endDate },
    });
    return response.data;
  },
};


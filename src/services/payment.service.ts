import apiClient from "@/lib/apiClient";
import { Payment, CreatePaymentData } from "@/types/payment";

export const paymentService = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/payments", { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },
  create: async (data: CreatePaymentData | Partial<Payment>) => {
    const response = await apiClient.post("/payments", data);
    return response.data;
  },
  createPayment: async (data: CreatePaymentData | Partial<Payment>) => {
    const response = await apiClient.post("/payments", data);
    return response.data;
  },
  getCustomerPayments: async () => {
    const response = await apiClient.get("/customers/payments");
    return response.data;
  },
  refund: async (paymentId: string) => {
    const response = await apiClient.post(`/payments/${paymentId}/refund`, {});
    return response.data;
  },
};


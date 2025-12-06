import api from "../apiClient";
import { Payment } from "@/types";

export const paymentService = {
  createPayment: async (data: Partial<Payment>) => {
    const response = await api.post("/api/payments", data);
    return response.data;
  },
  getPayments: async (params?: any) => {
    const response = await api.get("/api/payments", { params });
    return response.data;
  },
  getCustomerPayments: async () => {
    const response = await api.get("/api/customers/payments");
    return response.data;
  },
};

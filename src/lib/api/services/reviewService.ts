import api from "../axios";
import { Review } from "@/types";

export const reviewService = {
  createReview: async (data: Partial<Review>) => {
    const response = await api.post("/api/reviews", data);
    return response.data;
  },
  updateReview: async (reviewId: string, data: { rating?: number; comment?: string }) => {
    const response = await api.put(`/api/reviews/${reviewId}`, data);
    return response.data;
  },
  deleteReview: async (reviewId: string) => {
    const response = await api.delete(`/api/reviews/${reviewId}`);
    return response.data;
  },
  getCustomerReviews: async () => {
    const response = await api.get("/api/customers/reviews");
    return response.data;
  },
};

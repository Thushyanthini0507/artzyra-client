import apiClient from "@/lib/apiClient";
import { Review, CreateReviewData, UpdateReviewData } from "@/types/review";

export const reviewService = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get("/reviews", { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/reviews/${id}`);
    return response.data;
  },
  create: async (data: CreateReviewData | Partial<Review>) => {
    const response = await apiClient.post("/reviews", data);
    return response.data;
  },
  createReview: async (data: CreateReviewData | Partial<Review>) => {
    const response = await apiClient.post("/reviews", data);
    return response.data;
  },
  update: async (reviewId: string, data: Partial<UpdateReviewData>) => {
    const response = await apiClient.patch(`/reviews/${reviewId}`, data);
    return response.data;
  },
  updateReview: async (reviewId: string, data: Partial<UpdateReviewData>) => {
    const response = await apiClient.patch(`/reviews/${reviewId}`, data);
    return response.data;
  },
  delete: async (reviewId: string) => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
  deleteReview: async (reviewId: string) => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
  getCustomerReviews: async () => {
    const response = await apiClient.get("/customers/reviews");
    return response.data;
  },
};


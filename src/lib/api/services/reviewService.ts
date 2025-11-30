import api from "../axios";
import { Review } from "@/types";

export const reviewService = {
  createReview: async (data: Partial<Review>) => {
    const response = await api.post("/api/reviews", data);
    return response.data;
  },
  getCustomerReviews: async () => {
    const response = await api.get("/api/customers/reviews");
    return response.data;
  },
};

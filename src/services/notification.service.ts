import apiClient from "@/lib/apiClient";

export const notificationService = {
  getAll: async (params?: any) => {
    try {
      // Remove undefined values from params to avoid issues
      const cleanParams = params ? Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
      ) : {};
      const response = await apiClient.get("/notifications", { 
        params: cleanParams,
        timeout: 15000, // 15 second timeout for notifications specifically
      });
      return response.data;
    } catch (error: any) {
      // Handle 429 rate limiting errors
      if (error.response?.status === 429) {
        // The retry logic in apiClient should have already attempted retries
        // If we still get 429, all retries were exhausted
        throw {
          ...error,
          isRateLimitError: true,
          userMessage: error.userMessage || "Too many requests. Please wait a moment and try again.",
        };
      }
      
      // Re-throw with additional context for network errors
      if (!error.response && (error.code === "ERR_NETWORK" || error.message === "Network Error")) {
        throw {
          ...error,
          isNetworkError: true,
          isNotificationError: true,
        };
      }
      throw error;
    }
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  },
  markAsRead: async (notificationId: string) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await apiClient.put("/notifications/read-all");
    return response.data;
  },
  delete: async (notificationId: string) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};


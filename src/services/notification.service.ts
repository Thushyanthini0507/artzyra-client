import apiClient from "@/lib/apiClient";

export const notificationService = {
  getAll: async (params?: any) => {
    // Remove undefined values from params to avoid issues
    const cleanParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    ) : {};
    const response = await apiClient.get("/notifications", { 
      params: cleanParams,
      timeout: 15000, // 15 second timeout for notifications specifically
    });
    return response.data;
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


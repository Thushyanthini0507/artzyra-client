import api from "../apiClient";

export const notificationService = {
  getNotifications: async (params?: any) => {
    const response = await api.get("/api/notifications", { params });
    return response.data;
  },
  markAsRead: async (notificationId: string) => {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put("/api/notifications/read-all");
    return response.data;
  },
  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response.data;
  },
};

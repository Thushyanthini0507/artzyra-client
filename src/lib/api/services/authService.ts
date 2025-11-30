import api from "../axios";

export const authService = {
  registerCustomer: async (data: any) => {
    const response = await api.post("/api/auth/register/customer", data);
    return response.data;
  },
  registerArtist: async (data: any) => {
    const response = await api.post("/api/auth/register/artist", data);
    return response.data;
  },
  login: async (data: any) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
  },
};

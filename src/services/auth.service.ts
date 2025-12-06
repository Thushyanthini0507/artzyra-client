import apiClient from "@/lib/apiClient";
import { LoginCredentials, RegisterData } from "@/types/user";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },
  register: async (data: RegisterData) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  registerCustomer: async (data: RegisterData) => {
    const response = await apiClient.post("/auth/register/customer", data);
    return response.data;
  },
  registerArtist: async (data: RegisterData) => {
    const response = await apiClient.post("/auth/register/artist", data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};


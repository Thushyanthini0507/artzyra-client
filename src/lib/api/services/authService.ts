import api from "../apiClient";

export const authService = {
  registerCustomer: async (data: any) => {
    try {
      const response = await api.post("/api/auth/register/customer", data);
      return response.data;
    } catch (error: any) {
      // Handle registration errors gracefully
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      return {
        success: false,
        error: errorMessage,
        data: null,
      };
    }
  },
  registerArtist: async (data: any) => {
    try {
      const response = await api.post("/api/auth/register/artist", data);
      return response.data;
    } catch (error: any) {
      // Handle registration errors gracefully
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      return {
        success: false,
        error: errorMessage,
        data: null,
      };
    }
  },
  login: async (data: any) => {
    try {
      const response = await api.post("/api/auth/login", data);
      return response.data;
    } catch (error: any) {
      // Handle login errors gracefully
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      return {
        success: false,
        error: errorMessage,
        data: null,
      };
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get("/api/auth/me");
      return response.data;
    } catch (error: any) {
      // Handle getCurrentUser errors gracefully
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to get user",
        data: null,
      };
    }
  },
  logout: async () => {
    try {
      const response = await api.post("/api/auth/logout");
      return response.data;
    } catch (error: any) {
      // Logout errors are not critical, just return success
      return { success: true };
    }
  },
};

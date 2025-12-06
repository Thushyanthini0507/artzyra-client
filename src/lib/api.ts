import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to attach token automatically
api.interceptors.request.use(
  (config) => {
    let token = Cookies.get("token");

    // fallback to localStorage if cookie missing
    if (!token && typeof window !== "undefined") {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        token = localToken;
        Cookies.set("token", token, { expires: 7, path: "/", sameSite: "lax" });
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url || "unknown";

    // If 401 on /auth/me, silently reject (unauthenticated)
    if (error.response?.status === 401 && url?.includes("/api/auth/me")) {
      return Promise.reject(error);
    }

    // Remove invalid token on 401 elsewhere
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        Cookies.remove("token");
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(error);
  }
);

export default api;

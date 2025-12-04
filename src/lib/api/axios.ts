import axios from "axios";
import Cookies from "js-cookie";

// Use internal Next.js API routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ... (imports)

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    console.log("Axios Interceptor - Token from cookie:", token ? "Found" : "Missing", "Path:", config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        Cookies.remove("token");
        // Optional: window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

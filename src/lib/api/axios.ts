import axios from "axios";
import Cookies from "js-cookie";

// Use external backend API (defaults to localhost:5000 for development)
// Set NEXT_PUBLIC_API_URL in .env.local to override
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    console.log("Axios Interceptor - Full URL:", `${config.baseURL}${config.url}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Axios Interceptor - Authorization header set:", `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.warn("Axios Interceptor - No token found in cookies for request to:", config.url);
    }
    
    return config;
  },
  (error) => {
    console.error("Axios Interceptor - Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log("Axios Interceptor - Response success:", response.config?.url || "unknown", "Status:", response.status);
    return response;
  },
  (error) => {
    // Better error logging
    const errorInfo: any = {
      message: error.message || "Unknown error",
      code: error.code,
      url: error.config?.url || "unknown",
      method: error.config?.method || "unknown",
    };

    if (error.response) {
      // Server responded with error status
      errorInfo.status = error.response.status;
      errorInfo.statusText = error.response.statusText;
      errorInfo.data = error.response.data;
      
      console.error("Axios Interceptor - Response error:", errorInfo);
      console.error("Axios Interceptor - Error details:", {
        url: errorInfo.url,
        method: errorInfo.method,
        status: errorInfo.status,
        statusText: errorInfo.statusText,
        errorData: errorInfo.data,
      });
      
      if (error.response.status === 401) {
        console.error("Axios Interceptor - 401 Unauthorized. Token might be invalid or expired.");
        console.error("Axios Interceptor - Current token:", Cookies.get("token") ? "Exists" : "Missing");
        console.error("Axios Interceptor - Request URL:", error.config?.baseURL + error.config?.url);
        
        // Handle unauthorized access
        if (typeof window !== "undefined") {
          Cookies.remove("token");
          console.warn("Axios Interceptor - Token removed. User needs to login again.");
          // Optional: redirect to login
          // window.location.href = "/auth/login";
        }
      } else if (error.response.status === 404) {
        console.error("Axios Interceptor - 404 Not Found. Check if the endpoint exists on the backend.");
      } else if (error.response.status >= 500) {
        console.error("Axios Interceptor - Server error. Backend might be down or experiencing issues.");
      }
    } else if (error.request) {
      // Request was made but no response received
      errorInfo.requestError = "No response received";
      console.error("Axios Interceptor - Request made but no response received:", errorInfo);
      console.error("Axios Interceptor - This usually means:", {
        "1": "Backend server is not running",
        "2": "CORS issue preventing the request",
        "3": "Network connectivity problem",
        "4": "Backend URL is incorrect",
        url: error.config?.baseURL + error.config?.url,
      });
    } else {
      // Error setting up the request
      errorInfo.setupError = "Error setting up request";
      console.error("Axios Interceptor - Error setting up request:", errorInfo);
      console.error("Axios Interceptor - Error message:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

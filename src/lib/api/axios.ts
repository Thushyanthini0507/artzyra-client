import axios from "axios";
import Cookies from "js-cookie";

let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Remove trailing slash if present
if (API_BASE_URL.endsWith("/")) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

// Remove trailing /api if present to prevent double /api/api paths
// since our service calls already include /api prefix
if (API_BASE_URL.endsWith("/api")) {
  API_BASE_URL = API_BASE_URL.slice(0, -4);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
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

import axios from "axios";
import Cookies from "js-cookie";

// Get API URL with fallback
const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn(
      "NEXT_PUBLIC_API_URL is not set. Using default: http://localhost:5000/api"
    );
    return "http://localhost:5000/api";
  }
  return apiUrl;
};

const apiClient = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000, // Increased to 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CRITICAL: Must be true for cookies to work
});

// Request: Add token from cookies as fallback (backend reads from cookie first)
apiClient.interceptors.request.use((config) => {
  // Backend will read from cookie automatically, but we also send in header as fallback
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Handle 401, 403, network errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      const isNetworkError = error.code === "ERR_NETWORK" || error.message === "Network Error";
      if (isNetworkError) {
        console.error("Network Error:", {
          message: error.message,
          code: error.code,
          config: {
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            method: error.config?.method,
          },
        });
        // Don't throw for notification endpoints - they're non-critical
        const isNotificationEndpoint = error.config?.url?.includes("/notifications");
        if (isNotificationEndpoint) {
          console.warn("Notification request failed - this is non-critical");
          // Return a rejected promise with a specific error code
          return Promise.reject({
            ...error,
            isNetworkError: true,
            isNotificationError: true,
          });
        }
      }
    }

    // Handle 401 Unauthorized (no token or invalid token)
    if (error.response?.status === 401) {
      // Don't redirect for login/auth endpoints - let them handle their own errors
      const isAuthEndpoint = error.config?.url?.includes("/auth/login") || 
                             error.config?.url?.includes("/auth/register");
      
      if (!isAuthEndpoint) {
        // Clear client-side storage (backend cookie is cleared by logout endpoint)
        Cookies.remove("token");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // Only redirect if not already on login page
          if (window.location.pathname !== "/auth/login") {
            window.location.href = "/auth/login";
          }
        }
      }
    }
    // Handle 403 Forbidden (token valid but not approved/authorized)
    // Don't redirect to login for 403 - user is authenticated but not authorized
    // Let the component handle the error message
    if (error.response?.status === 403) {
      // Don't clear token or redirect - user is logged in but not approved
      // The error will be handled by the calling component
      console.warn(
        "403 Forbidden - User not approved or insufficient permissions"
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import axios from "axios";
import Cookies from "js-cookie";

// Get API URL with fallback
const getApiUrl = () => {
  // Check if running on client-side and on localhost
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    console.warn("⚠️ Running on localhost - Forcing API URL to http://localhost:5000/api");
    return "http://localhost:5000/api";
  }

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
  timeout: 60000, // Increased to 60 seconds
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
  
  // If data is FormData, remove Content-Type header to let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  
  return config;
});

// Response: Handle 401, 403, network errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      const isNetworkError = error.code === "ERR_NETWORK" || 
                            error.message === "Network Error" ||
                            error.code === "ECONNREFUSED" ||
                            error.code === "ETIMEDOUT" ||
                            error.message?.includes("Network Error");
      
      if (isNetworkError) {
        const apiUrl = getApiUrl();
        const fullUrl = error.config?.baseURL 
          ? `${error.config.baseURL}${error.config.url || ""}`
          : `${apiUrl}${error.config?.url || ""}`;
        
        // Extract error details into a plain object to ensure proper serialization
        const errorDetails = {
          message: String(error.message || "Network request failed"),
          code: String(error.code || "UNKNOWN"),
          requestUrl: String(fullUrl),
          method: String(error.config?.method?.toUpperCase() || "GET"),
          baseURL: String(error.config?.baseURL || apiUrl),
          endpoint: String(error.config?.url || "unknown"),
          timeout: error.config?.timeout ? Number(error.config.timeout) : null,
          stack: error.stack ? String(error.stack).split('\n').slice(0, 3).join('\n') : "No stack trace",
        };
        
        // Log error details in a way that ensures visibility
        console.error("🔴 Network Error Detected");
        console.error("Error Message:", errorDetails.message);
        console.error("Error Code:", errorDetails.code);
        console.error("Request URL:", errorDetails.requestUrl);
        console.error("HTTP Method:", errorDetails.method);
        console.error("Base URL:", errorDetails.baseURL);
        console.error("Endpoint:", errorDetails.endpoint);
        console.error("Timeout:", errorDetails.timeout || "Not set");
        console.error("Possible Causes:", [
          "Backend server is not running",
          "API URL is incorrect",
          "CORS configuration issue",
          "Network connectivity problem",
        ]);
        console.error("Full Error Object:", JSON.stringify(errorDetails, null, 2));
        
        // Don't throw for notification endpoints - they're non-critical
        const isNotificationEndpoint = error.config?.url?.includes("/notifications");
        if (isNotificationEndpoint) {
          console.warn("Notification request failed - this is non-critical");
          // Return a rejected promise with a specific error code
          return Promise.reject({
            ...error,
            isNetworkError: true,
            isNotificationError: true,
            userMessage: "Unable to fetch notifications. Please check your connection.",
          });
        }
        
        // Enhance error object with additional properties while preserving original structure
        Object.assign(error, {
          isNetworkError: true,
          userMessage: `Unable to connect to the server. Please ensure the backend is running at ${apiUrl}`,
          apiUrl: apiUrl,
          requestUrl: fullUrl,
        });
        
        // Ensure message and code are set
        if (!error.message) error.message = "Network Error";
        if (!error.code) error.code = "ERR_NETWORK";
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
    // Handle 409 Conflict (usually duplicate key errors or resource conflicts)
    // Don't redirect to login - these are business logic errors
    if (error.response?.status === 409) {
      console.warn(
        "409 Conflict - Resource conflict detected:",
        error.response?.data?.message || error.message
      );
      // Enhance error with user-friendly message
      error.userMessage = error.response?.data?.message || 
        "A conflict occurred. This may be due to a duplicate entry or concurrent request.";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

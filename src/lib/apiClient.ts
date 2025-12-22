import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Extend AxiosRequestConfig to include retry count
declare module "axios" {
  export interface AxiosRequestConfig {
    __retryCount?: number;
  }
}

const apiClient = axios.create({
  baseURL: apiUrl,
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

// Helper function for exponential backoff with jitter
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRetryDelay = (retryCount: number, retryAfter?: string): number => {
  // If Retry-After header is present, use it (convert to milliseconds)
  if (retryAfter) {
    const retryAfterMs = parseInt(retryAfter, 10) * 1000;
    // Add some jitter (±20%)
    const jitter = retryAfterMs * 0.2 * (Math.random() * 2 - 1);
    return Math.max(1000, retryAfterMs + jitter);
  }
  
  // Exponential backoff: baseDelay * 2^retryCount with jitter
  const baseDelay = 1000; // 1 second
  const exponentialDelay = baseDelay * Math.pow(2, retryCount);
  const jitter = exponentialDelay * 0.3 * Math.random(); // ±30% jitter
  return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
};

// Response: Handle 401, 403, network errors, and 429 rate limiting
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 429 Too Many Requests with retry logic
    if (error.response?.status === 429) {
      const config = error.config;
      
      // Don't retry if retry count exceeds max or if request doesn't support retries
      const maxRetries = 3;
      const retryCount = config.__retryCount || 0;
      
      // Only retry GET requests and other safe methods
      const isRetryableMethod = ['get', 'head', 'options'].includes(
        config?.method?.toLowerCase() || ''
      );
      
      if (retryCount < maxRetries && isRetryableMethod) {
        config.__retryCount = retryCount + 1;
        
        // Get Retry-After header if present
        const retryAfter = error.response?.headers?.['retry-after'] || 
                          error.response?.headers?.['Retry-After'];
        
        const delayMs = getRetryDelay(retryCount, retryAfter);
        
        console.warn(
          `Rate limited (429). Retrying in ${Math.round(delayMs / 1000)}s... (Attempt ${retryCount + 1}/${maxRetries})`
        );
        
        await delay(delayMs);
        
        // Retry the request
        return apiClient(config);
      } else {
        // Max retries reached or non-retryable method
        console.error(
          `Rate limit exceeded (429). ${retryCount >= maxRetries ? 'Max retries reached.' : 'Request method not retryable.'}`
        );
        
        // Enhance error with user-friendly message
        error.userMessage = 
          "Too many requests. Please wait a moment and try again.";
      }
    }
    
    // Handle network errors (no response from server)
    if (!error.response) {
      const isNetworkError =
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.code === "ECONNREFUSED" ||
        error.code === "ETIMEDOUT" ||
        error.message?.includes("Network Error");

      if (isNetworkError) {
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
          stack: error.stack
            ? String(error.stack).split("\n").slice(0, 3).join("\n")
            : "No stack trace",
        };

        // Log error details in a way that ensures visibility
        console.error("Network Error Detected");
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
        console.error(
          "Full Error Object:",
          JSON.stringify(errorDetails, null, 2)
        );

        // Don't throw for notification endpoints - they're non-critical
        const isNotificationEndpoint =
          error.config?.url?.includes("/notifications");
        if (isNotificationEndpoint) {
          console.warn("Notification request failed - this is non-critical");
          // Return a rejected promise with a specific error code
          return Promise.reject({
            ...error,
            isNetworkError: true,
            isNotificationError: true,
            userMessage:
              "Unable to fetch notifications. Please check your connection.",
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
      const isAuthEndpoint =
        error.config?.url?.includes("/auth/login") ||
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
      error.userMessage =
        error.response?.data?.message ||
        "A conflict occurred. This may be due to a duplicate entry or concurrent request.";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

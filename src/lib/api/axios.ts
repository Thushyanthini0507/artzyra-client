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
    // Try to get token from cookies first, then localStorage as fallback
    let token = Cookies.get("token");
    
    // Fallback to localStorage if cookie is not available
    if (!token && typeof window !== "undefined") {
      const localStorageToken = localStorage.getItem("token");
      if (localStorageToken) {
        token = localStorageToken;
        console.log("🔵 Axios - Token found in localStorage, syncing to cookie...");
        // Try to sync back to cookie
        try {
          Cookies.set("token", token, { expires: 7, path: "/", sameSite: "lax" });
        } catch (e) {
          console.warn("🔵 Axios - Could not sync token to cookie:", e);
        }
      }
    }
    
    const fullUrl = `${config.baseURL}${config.url}`;
    
    console.group("🔵 Axios Request Interceptor");
    console.log("URL:", fullUrl);
    console.log("Method:", config.method?.toUpperCase() || "GET");
    console.log("Token in cookie:", Cookies.get("token") ? `Found (${Cookies.get("token")?.length} chars)` : "❌ MISSING");
    console.log("Token in localStorage:", typeof window !== "undefined" && localStorage.getItem("token") ? `Found` : "❌ MISSING");
    console.log("Token to use:", token ? `✅ Found (${token.length} chars)` : "❌ MISSING");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header set:", `Bearer ${token.substring(0, 30)}...`);
      console.log("Full token (first 50 chars):", token.substring(0, 50));
    } else {
      console.warn("⚠️ No token found in cookies or localStorage!");
      console.warn("All cookies:", Cookies.get());
      if (typeof window !== "undefined") {
        console.warn("localStorage keys:", Object.keys(localStorage));
      }
    }
    
    // Log all headers being sent (for debugging)
    console.log("Request headers:", {
      Authorization: config.headers.Authorization ? "✅ Set" : "❌ Missing",
      "Content-Type": config.headers["Content-Type"],
      ...(config.headers as any),
    });
    
    console.groupEnd();
    
    return config;
  },
  (error) => {
    console.error("❌ Axios Interceptor - Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response Success:", response.config?.url || "unknown", "Status:", response.status);
    return response;
  },
  (error) => {
    console.group("🔴 Axios Response Error");
    
    // Extract error information safely
    const url = error?.config?.url || "unknown";
    const method = error?.config?.method?.toUpperCase() || "unknown";
    const fullUrl = error?.config?.baseURL 
      ? `${error.config.baseURL}${url}` 
      : url;
    
    // Check what type of error we have
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const statusText = error.response.statusText;
      const responseData = error.response.data;
      const requestHeaders = error.config?.headers || {};
      
      // Check if this is /api/auth/me and it's already marked as broken
      const isAuthMeEndpoint = fullUrl.includes("/api/auth/me");
      const isAuthMeBroken = typeof window !== "undefined" && localStorage.getItem("authMeBroken") === "true";
      
      // Check for schema/populate errors on /api/auth/me (500 errors)
      const errorMessage = responseData?.message || "";
      const isSchemaError = status === 500 && (
        errorMessage.includes("populate") || 
        errorMessage.includes("schema") ||
        errorMessage.includes("category")
      );
      
      // If it's /api/auth/me with a 500 error (schema issue), mark as broken and suppress
      if (isAuthMeEndpoint && (isAuthMeBroken || isSchemaError || status === 500)) {
        // Mark as broken if it's a schema error or 500
        if ((isSchemaError || status === 500) && typeof window !== "undefined") {
          localStorage.setItem("authMeBroken", "true");
        }
        // Silently skip - don't log errors for broken endpoint
        return Promise.reject(error);
      }
      
      // Suppress errors for optional endpoints (recent users is optional)
      // Also suppress 400 errors for /api/admin/users when called without role (backend requirement)
      const isUsersEndpoint = fullUrl.includes("/api/admin/users");
      if (isUsersEndpoint) {
        // Check for schema errors (500 with populate message)
        const usersSchemaError = status === 500 && (
          errorMessage.includes("populate") || 
          errorMessage.includes("schema") ||
          errorMessage.includes("category")
        );
        
        // Check if it's a 400 error about missing role parameter
        const isMissingRoleError = status === 400 && (
          errorMessage.includes("role") || 
          errorMessage.includes("Please specify")
        );
        
        // Suppress ALL errors for users endpoint (400, 404, 500 schema errors)
        // This endpoint has backend schema issues and is used for optional features
        if (status === 404 || isMissingRoleError || usersSchemaError || status === 500) {
          // Silently handle - these are expected or backend issues
          // Don't log to console to avoid spam - return immediately without logging
          return Promise.reject(error);
        }
      }
      
      // Suppress errors for optional endpoints that may not exist or fail during development
      const isOptionalEndpoint = fullUrl.includes("/api/admin/payments") || 
                                 fullUrl.includes("/api/admin/bookings") ||
                                 fullUrl.includes("/api/customers/bookings") ||
                                 fullUrl.includes("/api/customers/profile") ||
                                 fullUrl.includes("/api/customers/reviews") ||
                                 fullUrl.includes("/api/artists/bookings") ||
                                 fullUrl.includes("/api/artists/profile");
      if (isOptionalEndpoint && (status === 401 || status === 403 || status === 404 || status === 500)) {
        // Silently handle errors for optional endpoints (they may not exist, user may not be logged in, or wrong role)
        // Return immediately without logging
        return Promise.reject(error);
      }
      
      // Don't log 401 errors for login endpoint with pending approval message - it's a user-friendly message
      const isLoginEndpoint = fullUrl.includes("/api/auth/login");
      if (isLoginEndpoint && status === 401) {
        const errorMessage = responseData?.message || "";
        if (errorMessage.includes("pending approval") || errorMessage.includes("approval")) {
          // This is a user-friendly error message, don't log detailed analysis
          // Just reject and let the auth context handle it
          return Promise.reject(error);
        }
      }
      
      console.error("❌ Server responded with error");
      console.error("URL:", fullUrl);
      console.error("Method:", method);
      console.error("Status:", status, statusText);
      console.error("Response Data:", JSON.stringify(responseData, null, 2));
      
      // Show what headers were sent
      console.log("Request Headers Sent:", {
        Authorization: requestHeaders.Authorization 
          ? `✅ ${requestHeaders.Authorization.substring(0, 30)}...` 
          : "❌ MISSING",
        "Content-Type": requestHeaders["Content-Type"] || "N/A",
      });
      
      if (status === 401) {
        // Skip detailed analysis for login endpoint with pending approval (already handled above)
        const isLoginEndpoint = fullUrl.includes("/api/auth/login");
        const errorMessage = responseData?.message || "";
        const isPendingApproval = errorMessage.includes("pending approval") || errorMessage.includes("approval");
        
        if (!isLoginEndpoint || !isPendingApproval) {
          console.error("\n🚨 401 UNAUTHORIZED - Detailed Analysis:");
          const currentToken = Cookies.get("token");
          console.error("  Token in cookie:", currentToken ? `✅ Found (${currentToken.length} chars)` : "❌ MISSING");
          console.error("  Authorization header sent:", requestHeaders.Authorization ? "✅ Yes" : "❌ No");
          
          if (requestHeaders.Authorization) {
            console.error("  Header value:", requestHeaders.Authorization.substring(0, 50) + "...");
          }
          
          console.error("\n  Possible causes:");
          console.error("    1. Backend expects token in different format (e.g., without 'Bearer' prefix)");
          console.error("    2. Backend JWT_SECRET doesn't match the token's secret");
          console.error("    3. Token expired or invalid");
          console.error("    4. Backend middleware not reading Authorization header correctly");
          console.error("    5. CORS issue - Authorization header not being sent to backend");
          
          console.error("\n  Backend should check:");
          console.error("    - req.headers.authorization (lowercase)");
          console.error("    - req.headers['authorization']");
          console.error("    - req.get('authorization')");
          
          // Handle unauthorized access - only remove token if it exists
          if (typeof window !== "undefined") {
            const existingToken = Cookies.get("token") || localStorage.getItem("token");
            if (existingToken) {
              Cookies.remove("token");
              localStorage.removeItem("token");
              console.warn("  ⚠️ Token removed. User needs to login again.");
            } else {
              console.warn("  ⚠️ No token to remove - user was never logged in or token was already cleared.");
            }
          }
        }
      } else if (status === 404) {
        console.error("❌ 404 Not Found");
        console.error("  Endpoint:", fullUrl);
        console.error("  Check if this endpoint exists on your backend");
      } else if (status >= 500) {
        console.error("❌ Server Error (5xx)");
        console.error("  Backend might be down or experiencing issues");
        console.error("  Common causes:");
        console.error("    1. Database connection issue");
        console.error("    2. Schema/populate error (check backend logs)");
        console.error("    3. Missing environment variables");
        console.error("    4. Backend code error");
        
        // If it's a schema error, provide specific guidance and mark endpoint as broken
        if (responseData?.message?.includes("populate") || responseData?.message?.includes("schema")) {
          console.error("\n  🚨 SCHEMA ERROR DETECTED:");
          console.error("  Your backend is trying to populate a field that doesn't exist.");
          console.error("  Check BACKEND_SCHEMA_FIX.md for details.");
          console.error("  Error:", responseData.message);
          
          // Mark /api/auth/me as broken in localStorage to prevent future calls
          if (typeof window !== "undefined" && fullUrl.includes("/api/auth/me")) {
            localStorage.setItem("authMeBroken", "true");
            console.warn("  ✅ Endpoint marked as broken - will be skipped on future requests");
          }
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("❌ No response received from server");
      console.error("URL:", fullUrl);
      console.error("Method:", method);
      console.error("\n  Possible causes:");
      console.error("    1. Backend server is not running on port 5000");
      console.error("    2. CORS issue preventing the request");
      console.error("    3. Network connectivity problem");
      console.error("    4. Backend URL is incorrect");
      console.error("\n  Test backend connection:");
      console.error(`    curl -X ${method} ${fullUrl}`);
      console.error(`    curl -X ${method} ${fullUrl} -H "Authorization: Bearer YOUR_TOKEN"`);
    } else {
      // Error setting up the request
      console.error("❌ Error setting up request");
      console.error("URL:", fullUrl);
      console.error("Method:", method);
      console.error("Error message:", error.message || "Unknown error");
      console.error("Error code:", error.code || "N/A");
    }
    
    console.groupEnd();
    
    return Promise.reject(error);
  }
);

export default api;

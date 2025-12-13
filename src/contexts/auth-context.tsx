"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, UserRole } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  /** -----------------------------
   * NORMALIZE USER (FIXED VERSION)
   * ------------------------------*/
  const normalizeUser = (raw: any): User | null => {
    if (!raw) return null;
    const user = raw.user || raw;
    const profile = raw.profile || raw.data?.profile;

    // Normalize role to lowercase
    const normalizedRole = String(user.role || "")
      .toLowerCase()
      .trim();

    // Get name from profile first (most accurate), then fallback to user.name, then email, then "User"
    const userName = 
      profile?.name || 
      user.name || 
      user.username || 
      user.fullName || 
      user.email?.split("@")[0] || 
      "User";

    // CRITICAL: Spread user first, then override with normalized values
    // This ensures our normalized role is not overwritten
    return {
      ...user,  // Spread first
      _id: user._id || user.id,
      email: user.email || "",
      name: userName,
      role: normalizedRole as UserRole,  // Override with normalized role AFTER spread
      status: user.status || profile?.status,
    } as User;
  };

  /** -----------------------------
   * REFRESH USER (SAFE VERSION)
   * ------------------------------*/
  const refreshUser = async () => {
    // Skip if endpoint is marked as broken (backend schema issue)
    if (typeof window !== "undefined" && localStorage.getItem("authMeBroken") === "true") {
      console.log("🔵 AuthContext - Skipping /api/auth/me (endpoint marked as broken)");
      const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
      
      // Try to decode user from JWT token as fallback
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const userFromToken = {
              _id: payload.userId || payload.id || payload._id,
              email: payload.email || "",
              name: payload.name || payload.email?.split("@")[0] || "User",
              role: String(payload.role || "").toLowerCase().trim(),
            };
            console.log("🔵 AuthContext - Decoded user from JWT token:", userFromToken);
            setUser(userFromToken as User);
          }
        } catch (e) {
          console.warn("🔵 AuthContext - Could not decode JWT token:", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getCurrentUser();
      if (res.success && res.data) {
        // Pass both user and profile to normalizeUser
        const normalized = normalizeUser({ user: res.data.user, profile: res.data.profile });
        setUser(normalized);
      } else {
        // Fallback: try to decode from JWT token
        const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const userFromToken = {
                _id: payload.userId || payload.id || payload._id,
                email: payload.email || "",
                name: payload.name || payload.email?.split("@")[0] || "User",
                role: String(payload.role || "").toLowerCase().trim(),
              };
              console.log("🔵 AuthContext - Fallback: Decoded user from JWT token:", userFromToken);
              setUser(userFromToken as User);
            } else {
              const hasToken = Cookies.get("token");
              if (!hasToken) setUser(null);
            }
          } catch (e) {
            const hasToken = Cookies.get("token");
            if (!hasToken) setUser(null);
          }
        } else {
          const hasToken = Cookies.get("token");
          if (!hasToken) setUser(null);
        }
      }
    } catch (error: any) {
      // Handle 403 Forbidden (user authenticated but not approved) - don't clear user
      if (error.response?.status === 403) {
        console.warn("🔵 AuthContext - 403 Forbidden: User authenticated but not approved");
        // Don't clear user - they're logged in but pending approval
        // Try to decode from JWT token to keep user in context
        const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const userFromToken = {
                _id: payload.userId || payload.id || payload._id,
                email: payload.email || "",
                name: payload.name || payload.email?.split("@")[0] || "User",
                role: String(payload.role || "").toLowerCase().trim(),
              };
              console.log("🔵 AuthContext - 403: Keeping user from JWT token:", userFromToken);
              setUser(userFromToken as User);
            }
          } catch (e) {
            console.warn("🔵 AuthContext - Could not decode JWT token:", e);
          }
        }
      } else if (error.response?.status === 401) {
        // 401 Unauthorized - clear user and redirect
        console.warn("🔵 AuthContext - 401 Unauthorized: Clearing user");
        setUser(null);
      } else {
        // Other errors - try to decode from JWT token as fallback
        const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const userFromToken = {
                _id: payload.userId || payload.id || payload._id,
                email: payload.email || "",
                name: payload.name || payload.email?.split("@")[0] || "User",
                role: String(payload.role || "").toLowerCase().trim(),
              };
              console.log("🔵 AuthContext - Error fallback: Decoded user from JWT token:", userFromToken);
              setUser(userFromToken as User);
            } else {
              const hasToken = Cookies.get("token");
              if (!hasToken) setUser(null);
            }
          } catch (e) {
            const hasToken = Cookies.get("token");
            if (!hasToken) setUser(null);
          }
        } else {
          const hasToken = Cookies.get("token");
          if (!hasToken) setUser(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  /** -----------------------------
   * LOGIN (FULLY FIXED - COMPREHENSIVE)
   * ------------------------------*/
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      console.log("🔵 AuthContext - Raw login response:", JSON.stringify(response, null, 2));

      // Check if login was successful
      if (!response.success) {
        return { success: false, error: response.error || "Login failed" };
      }

      // Handle different response structures
      // Backend returns: { success: true, data: { user, token, redirectPath } }
      // authService returns: response.data which is the backend response
      const responseData = response.data || response;

      if (!responseData) {
        return { success: false, error: "Invalid login response" };
      }

      // Extract token and redirectPath - check multiple possible locations
      const token = responseData.token || responseData.data?.token;
      const backendRedirectPath = responseData.redirectPath || responseData.data?.redirectPath;
      const userData = responseData.user || responseData.data?.user || responseData;
      const profileData = responseData.profile || responseData.data?.profile;

      console.log("🔵 AuthContext - Extracted token:", token ? `✅ Found (${token.length} chars)` : "❌ Missing");
      console.log("🔵 AuthContext - Extracted redirectPath:", backendRedirectPath);
      console.log("🔵 AuthContext - Extracted userData:", userData ? "✅ Found" : "❌ Missing");

      if (!token) {
        return { success: false, error: "No token received from server" };
      }

      // Normalize user data - include profile if available
      const normalizedUser = normalizeUser({ user: userData, profile: profileData });
      if (!normalizedUser) {
        return { success: false, error: "Unable to process user data" };
      }

      // Get role for redirect - extract from multiple possible locations
      let role = normalizedUser.role?.toLowerCase().trim() || "";
      
      // If role is still empty, try to extract from raw userData
      if (!role && userData) {
        role = (userData.role || userData.userRole || "").toString().toLowerCase().trim();
      }
      
      // Final fallback: check the raw response
      if (!role && responseData) {
        const rawRole = responseData.role || responseData.data?.role || responseData.user?.role;
        if (rawRole) {
          role = rawRole.toString().toLowerCase().trim();
        }
      }
      
      // Additional fallback: check JWT token payload if role is still missing
      if (!role && token) {
        try {
          // Decode JWT without verification (just to get role)
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.role) {
              role = String(payload.role).toLowerCase().trim();
              console.log("🔵 AuthContext - Extracted role from JWT token:", role);
            }
          }
        } catch (e) {
          console.warn("🔵 AuthContext - Could not decode JWT token:", e);
        }
      }
      
      console.log("🔵 AuthContext - Raw userData:", JSON.stringify(userData, null, 2));
      console.log("🔵 AuthContext - Normalized user:", JSON.stringify(normalizedUser, null, 2));
      console.log("🔵 AuthContext - Extracted role:", role || "❌ EMPTY - This will cause redirect issues!");
      console.log("🔵 AuthContext - Backend redirectPath:", backendRedirectPath);
      
      // CRITICAL DEBUG: Log if role is admin but redirect might fail
      if (role === "admin") {
        console.log("✅ AuthContext - ADMIN ROLE DETECTED - Should redirect to /admin");
      } else {
        console.warn("⚠️ AuthContext - Role is NOT admin. Role value:", role, "Type:", typeof role);
      }

      // CRITICAL: Ensure user has the correct role before setting
      const userToSet: User = role && normalizedUser.role !== role 
        ? { ...normalizedUser, role: role as UserRole }
        : normalizedUser;
      
      // Set user BEFORE redirect so auth context is updated
      setUser(userToSet);
      console.log("🔵 AuthContext - User set in context with role:", userToSet.role);

      // Backend sets the HTTP-only cookie automatically
      // We only store in localStorage as fallback for debugging
      // The cookie is set by the backend with proper security settings
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        // Explicitly set cookie to ensure middleware can read it
        Cookies.set("token", token, { expires: 7, path: '/' }); 
        console.log("🔵 AuthContext - Token saved to localStorage and Cookie");
      }

      closeLogin();

      // -------------------------
      // REDIRECT LOGIC (PRIORITY: Query Param > Role-based > Backend)
      // -------------------------
      let redirectPath = "/";
      
      // HIGHEST PRIORITY: Check for redirect parameter from URL (e.g., from booking flow)
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get("redirect");
        if (redirectParam) {
          redirectPath = redirectParam;
          console.log("🔵 AuthContext - Using redirect parameter from URL:", redirectPath);
          // Use href for immediate redirect
          window.location.href = redirectPath;
          return { success: true, user: normalizedUser };
        }
      }
      
      // SECOND PRIORITY: Role-based redirect to ensure correct portal access
      // CRITICAL: Only redirect to /admin if role is explicitly "admin"
      // Never redirect to /admin if role is empty, undefined, or anything else
      if (role === "admin") {
        redirectPath = "/admin";
      } else if (role === "artist") {
        redirectPath = "/artist/dashboard"; // Always redirect artists to artist portal
      } else if (role === "customer") {
        redirectPath = "/customer";
      } else if (backendRedirectPath && backendRedirectPath !== "/" && backendRedirectPath !== "/admin") {
        // Only use backend redirectPath if it's not /admin and role is unknown
        redirectPath = backendRedirectPath;
      } else {
        // Default to home if role is unknown and backend path is invalid
        redirectPath = "/";
        console.warn("🔴 AuthContext - WARNING: Role is empty or unknown, redirecting to home. Role:", role);
      }
      
      // CRITICAL SAFETY CHECK: Never redirect to /admin if user is not admin
      if (redirectPath === "/admin" && role !== "admin") {
        console.error("🔴 AuthContext - SECURITY: Prevented redirect to /admin for non-admin user. Role:", role);
        if (role === "artist") {
          redirectPath = "/artist/dashboard";
        } else if (role === "customer") {
          redirectPath = "/customer";
        } else {
          redirectPath = "/";
        }
      }
      
      console.log("🔵 AuthContext - FINAL redirectPath:", redirectPath);
      console.log("🔵 AuthContext - User role confirmed:", role || "❌ EMPTY");
      console.log("🔵 AuthContext - Backend redirectPath (for reference):", backendRedirectPath);
      console.log("🔵 AuthContext - Redirecting artist to portal:", role === "artist" && redirectPath === "/artist/dashboard");
      
      // CRITICAL DEBUG: Log everything before redirect
      console.group("🚀 AUTH CONTEXT - PRE-REDIRECT DEBUG");
      console.log("Role extracted:", role);
      console.log("Normalized user role:", normalizedUser.role);
      console.log("User set in context role:", userToSet.role);
      console.log("Redirect path:", redirectPath);
      console.log("Token saved:", token ? "YES" : "NO");
      console.log("User object:", JSON.stringify(userToSet, null, 2));
      console.groupEnd();
      
      // Use window.location for immediate, reliable redirect
      if (typeof window !== "undefined") {
        console.log("🔵 AuthContext - Using window.location.href for redirect to:", redirectPath);
        console.log("🔵 AuthContext - User is set in context before redirect. Role:", userToSet.role);
        console.log("🔵 AuthContext - Executing redirect NOW...");
        
        // Use href for immediate redirect
        window.location.href = redirectPath;
      } else {
        router.replace(redirectPath);
      }

      return { success: true, user: normalizedUser };
    } catch (error: any) {
      console.error("🔴 AuthContext - Login error:", error);
      console.error("🔴 AuthContext - Error response:", error.response?.data);
      console.error("🔴 AuthContext - Error status:", error.response?.status);
      
      // Handle rate limiting (429)
      if (error.response?.status === 429) {
        const rateLimitMsg =
          error.response?.data?.message ||
          "Too many login attempts. Please wait 15 minutes before trying again.";
        return { success: false, error: rateLimitMsg };
      }
      
      // Extract error message from response
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please check your credentials.";

      console.log("🔴 AuthContext - Extracted error message:", msg);
      return { success: false, error: msg };
    }
  };

  /** -----------------------------
   * LOGOUT (CLEAN VERSION)
   * ------------------------------*/
  const logout = async () => {
    try {
      await authService.logout();
    } catch {}

    // Clear client-side storage
    Cookies.remove("token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isLoginOpen,
        openLogin,
        closeLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

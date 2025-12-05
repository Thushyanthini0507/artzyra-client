"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/auth";
import { authService } from "@/lib/api/services/authService";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
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

  const normalizeUser = (userData: any): User | null => {
    if (!userData) return null;
    
    // Handle different backend response structures
    const user = userData.user || userData;
    
    // Ensure required fields exist with fallbacks
    return {
      _id: user._id || user.id,
      email: user.email || "",
      name: user.name || user.username || user.fullName || user.email?.split("@")[0] || "User",
      role: user.role || "customer",
      status: user.status,
      ...user,
    } as User;
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        const normalizedUser = normalizeUser(response.data);
        setUser(normalizedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

// ...

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        // Normalize user data to handle different backend response structures
        const userData = response.data.user || response.data;
        const normalizedUser = normalizeUser(userData);
        
        if (normalizedUser) {
          setUser(normalizedUser);
          
          // Handle token - could be in response.data.token or response.data.accessToken, etc.
          const token = response.data.token || response.data.accessToken || response.token;
          if (token) {
            console.log("AuthContext - Setting token cookie:", token.substring(0, 10) + "...");
            Cookies.set("token", token, { expires: 7, path: "/" }); // Expires in 7 days, accessible everywhere
          }
          closeLogin();
          
          // Redirect based on role
          const role = normalizedUser.role;
          if (role === "admin") router.push("/admin");
          else if (role === "artist") router.push("/artist");
          else if (role === "customer") router.push("/customer");
          
          return { success: true, user: normalizedUser };
        }
      }
      return { success: false, error: response.error || "Login failed" };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || error.message || "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
    Cookies.remove("token");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, isLoginOpen, openLogin, closeLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, getUser, setUser as saveUser, clearAuth } from "@/lib/auth";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUserState(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<{ user: User; token: string }>("/api/auth/login", {
      email,
      password,
    });

    if (response.success && response.data) {
      const { user, token } = response.data;
      saveUser(user);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      setUserState(user);
      return { success: true };
    }

    return { success: false, error: response.error };
  };

  const logout = () => {
    clearAuth();
    setUserState(null);
  };

  const setUser = (user: User) => {
    saveUser(user);
    setUserState(user);
  };

  const refreshUser = async () => {
    const response = await api.get<User>("/api/auth/me");
    if (response.success && response.data) {
      saveUser(response.data);
      setUserState(response.data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, refreshUser }}>
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

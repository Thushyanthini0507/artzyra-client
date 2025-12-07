import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export function useLogin() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        setError(result.error || "Login failed");
      }
      return result;
    } catch (err: any) {
      // Backend returns error in 'message' field, but check both 'error' and 'message' for compatibility
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading, error };
}

export function useRegisterCustomer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerCustomer(data);
      if (response.success) {
        // Don't auto-login - redirect to login page instead
        router.push("/auth/login?registered=true");
        return { success: true };
      } else {
        setError(response.error || "Registration failed");
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      // Backend returns error in 'message' field, but check both 'error' and 'message' for compatibility
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Registration failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

export function useRegisterArtist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerArtist(data);
      if (response.success) {
        // Artist needs approval, so just redirect to login or success page
        router.push("/?registered=true");
        return { success: true };
      } else {
        setError(response.error || "Registration failed");
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      // Backend returns error in 'message' field, but check both 'error' and 'message' for compatibility
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Registration failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

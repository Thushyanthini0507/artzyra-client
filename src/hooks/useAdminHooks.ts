import { useState, useEffect } from "react";
import { adminService } from "@/lib/api/services/adminService";
import { categoryService } from "@/lib/api/services/categoryService";
import { toast } from "sonner";

// Admin Users Hook
export function useAdminUsers(role?: string) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers(role);
      if (response.success && response.data) {
        setUsers(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  return { users, loading, error, refresh: fetchUsers };
}

// Pending Artists Hook
export function usePendingArtists() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingArtists = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPendingArtists();
      if (response.success && response.data) {
        setArtists(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArtists();
  }, []);

  return { artists, loading, error, refresh: fetchPendingArtists };
}

// Admin Bookings Hook
export function useAdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await adminService.getBookings();
      if (response.success && response.data) {
        setBookings(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, loading, error, refresh: fetchBookings };
}

// Categories Hook (already exists in useApi.ts but adding here for completeness)
export function useAdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refresh: fetchCategories };
}

// Create Category Hook
export function useCreateCategory() {
  const [loading, setLoading] = useState(false);

  const createCategory = async (data: { name: string; description: string }) => {
    setLoading(true);
    try {
      const response = await categoryService.createCategory(data);
      if (response.success) {
        toast.success("Category created successfully");
        return { success: true, data: response.data };
      } else {
        toast.error(response.error || "Failed to create category");
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to create category";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading };
}

// Update Category Hook
export function useUpdateCategory() {
  const [loading, setLoading] = useState(false);

  const updateCategory = async (categoryId: string, data: { name: string; description: string }) => {
    setLoading(true);
    try {
      const response = await categoryService.updateCategory(categoryId, data);
      if (response.success) {
        toast.success("Category updated successfully");
        return { success: true, data: response.data };
      } else {
        toast.error(response.error || "Failed to update category");
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to update category";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading };
}

// Delete Category Hook
export function useDeleteCategory() {
  const [loading, setLoading] = useState(false);

  const deleteCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const response = await categoryService.deleteCategory(categoryId);
      if (response.success) {
        toast.success("Category deleted successfully");
        return { success: true };
      } else {
        toast.error(response.error || "Failed to delete category");
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to delete category";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { deleteCategory, loading };
}

// Approve Artist Hook
export function useApproveArtist() {
  const [loading, setLoading] = useState(false);

  const approveArtist = async (artistId: string) => {
    setLoading(true);
    try {
      const response = await adminService.approveArtist(artistId);
      if (response.success) {
        toast.success("Artist approved successfully");
        return { success: true };
      } else {
        toast.error(response.error || "Failed to approve artist");
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to approve artist";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { approveArtist, loading };
}

// Reject Artist Hook
export function useRejectArtist() {
  const [loading, setLoading] = useState(false);

  const rejectArtist = async (artistId: string, reason?: string) => {
    setLoading(true);
    try {
      const response = await adminService.rejectArtist(artistId);
      if (response.success) {
        toast.success("Artist rejected");
        return { success: true };
      } else {
        toast.error(response.error || "Failed to reject artist");
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to reject artist";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { rejectArtist, loading };
}

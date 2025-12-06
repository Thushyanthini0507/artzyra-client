import { useState, useEffect } from "react";
import { categoryService } from "@/services/category.service";
import { bookingService } from "@/services/booking.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useArtistsByCategory(categoryId: string | null) {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setArtists([]);
      return;
    }

    const fetchArtists = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryService.getArtistsByCategory(categoryId);
        if (response.success && response.data) {
          setArtists(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch artists");
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [categoryId]);

  return { artists, loading, error };
}

export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createBooking = async (data: any) => {
    setLoading(true);
    try {
      const response = await bookingService.createBooking(data);
      if (response.success) {
        toast.success("Booking created successfully!");
        router.push("/customer/bookings");
        return { success: true };
      } else {
        toast.error(response.error || "Failed to create booking");
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to create booking";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading };
}

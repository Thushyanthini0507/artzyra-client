import { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { artistService } from "@/services/artist.service";
import { customerService } from "@/services/customer.service";
import { bookingService } from "@/services/booking.service";
import { categoryService } from "@/services/category.service";

export function useFetchProfile(role: "artist" | "customer") {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let data;
        if (role === "artist") {
          data = await artistService.getProfile();
        } else {
          data = await customerService.getProfile();
        }
        setProfile(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [role]);

  return { profile, loading, error };
}

export function useBookings(role: "artist" | "customer" | "admin") {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        let data;
        if (role === "admin") {
          data = await adminService.getBookings();
        } else if (role === "artist") {
          data = await artistService.getBookings();
        } else {
          data = await customerService.getBookings();
        }
        setBookings(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [role]);

  return { bookings, loading, error };
}

export function useArtistPublicList(params?: any) {
  const [artists, setArtists] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await artistService.getAllArtists(params);
        setArtists(data.data);
        setPagination(data.pagination || null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch artists");
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [JSON.stringify(params)]);

  return { artists, pagination, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all active categories with a high limit to get all of them
        const data = await categoryService.getAllCategories({ isActive: true, limit: 100 });
        setCategories(data.data || []);
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

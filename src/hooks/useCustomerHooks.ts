import { useState, useEffect } from "react";
import { bookingService } from "@/lib/api/services/bookingService";
import { paymentService } from "@/lib/api/services/paymentService";
import { reviewService } from "@/lib/api/services/reviewService";
import { customerService } from "@/lib/api/services/customerService";
import { Booking, Payment, Review, Customer } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createBooking = async (data: Partial<Booking>) => {
    setLoading(true);
    try {
      const response = await bookingService.createBooking(data);
      if (response.success) {
        toast.success("Booking created successfully!");
        router.push("/customer/dashboard");
        return response.data;
      } else {
        toast.error(response.error || "Failed to create booking");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading };
}

export function useCustomerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getCustomerBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, loading, refresh: fetchBookings };
}

export function useUpdateBooking() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateBooking = async (id: string, data: Partial<Booking>) => {
    setLoading(true);
    try {
      const response = await bookingService.updateBooking(id, data);
      if (response.success) {
        toast.success("Booking updated successfully!");
        router.push("/customer/dashboard");
      } else {
        toast.error(response.error || "Failed to update booking");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  return { updateBooking, loading };
}

export function useDeleteBooking() {
  const [loading, setLoading] = useState(false);

  const deleteBooking = async (id: string, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const response = await bookingService.deleteBooking(id);
      if (response.success) {
        toast.success("Booking deleted successfully!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.error || "Failed to delete booking");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete booking");
    } finally {
      setLoading(false);
    }
  };

  return { deleteBooking, loading };
}

export function useCreateReview() {
  const [loading, setLoading] = useState(false);

  const createReview = async (data: Partial<Review>) => {
    setLoading(true);
    try {
      const response = await reviewService.createReview(data);
      if (response.success) {
        toast.success("Review submitted successfully!");
        return response.data;
      } else {
        toast.error(response.error || "Failed to submit review");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return { createReview, loading };
}

export function useCustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewService.getCustomerReviews();
        if (response.success) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return { reviews, loading };
}

export function useCreatePayment() {
  const [loading, setLoading] = useState(false);

  const createPayment = async (data: Partial<Payment>) => {
    setLoading(true);
    try {
      const response = await paymentService.createPayment(data);
      if (response.success) {
        toast.success("Payment successful!");
        return response.data;
      } else {
        toast.error(response.error || "Payment failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return { createPayment, loading };
}

export function useCustomerProfile() {
  const [profile, setProfile] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await customerService.getProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, refresh: fetchProfile };
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data: Partial<Customer>) => {
    setLoading(true);
    try {
      const response = await customerService.updateProfile(data);
      if (response.success) {
        toast.success("Profile updated successfully!");
        return response.data;
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
}

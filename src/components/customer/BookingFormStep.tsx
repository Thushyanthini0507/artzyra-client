"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateBooking } from "@/hooks/useBookingFlow";
import { DatePicker } from "@/components/ui/date-picker";
import { Controller } from "react-hook-form";
import { artistService } from "@/services/artist.service";
import { toast } from "sonner";

const bookingSchema = z.object({
  bookingDate: z.string().min(1, "Booking date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  specialRequests: z.string().optional(),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormStepProps {
  artistId: string;
  categoryId: string;
  onBack: () => void;
}

export function BookingFormStep({ artistId, categoryId, onBack }: BookingFormStepProps) {
  const { createBooking, loading } = useCreateBooking();
  const router = useRouter();
  const [checkingArtist, setCheckingArtist] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // Check if artist is physical - they cannot be booked
  useEffect(() => {
    const checkArtistType = async () => {
      try {
        const response = await artistService.getById(artistId);
        if (response.success && response.data) {
          if (response.data.artistType === 'physical') {
            toast.error("Physical artists cannot be booked directly. Please contact them via chat.");
            router.push(`/chat?artistId=${artistId}`);
            return;
          }
        }
      } catch (error) {
        console.error("Error checking artist type:", error);
        toast.error("Failed to load artist information");
        onBack();
      } finally {
        setCheckingArtist(false);
      }
    };

    if (artistId) {
      checkArtistType();
    }
  }, [artistId, router, onBack]);

  const onSubmit = async (data: BookingFormData) => {
    const bookingData = {
      artistId: artistId,
      categoryId: categoryId,
      bookingDate: data.bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location || "",
      specialRequests: data.specialRequests || "",
    };
    
    console.log("Sending booking data:", bookingData);
    await createBooking(bookingData);
  };

  if (checkingArtist) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={onBack} className="mb-2">
          ← Back to Artists
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading artist information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-2">
        ← Back to Artists
      </Button>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Booking Details</CardTitle>
          <CardDescription className="text-base">Fill in the details for your booking</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bookingDate">Booking Date *</Label>
              <Controller
                name="bookingDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                    placeholder="Select a date"
                  />
                )}
              />
              {errors.bookingDate && (
                <p className="text-sm text-red-500">{errors.bookingDate.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input id="startTime" type="time" {...register("startTime")} />
                {errors.startTime && (
                  <p className="text-sm text-red-500">{errors.startTime.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input id="endTime" type="time" {...register("endTime")} />
                {errors.endTime && (
                  <p className="text-sm text-red-500">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Jaffna Town"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                placeholder="e.g., Outdoor shoot, specific requirements..."
                {...register("specialRequests")}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating Booking..." : "Create Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

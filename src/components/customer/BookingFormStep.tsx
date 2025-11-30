"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateBooking } from "@/hooks/useBookingFlow";

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
  onBack: () => void;
}

export function BookingFormStep({ artistId, onBack }: BookingFormStepProps) {
  const { createBooking, loading } = useCreateBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    await createBooking({
      artist: artistId,
      ...data,
    });
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack}>
        ← Back to Artists
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Fill in the details for your booking</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bookingDate">Booking Date *</Label>
              <Input
                id="bookingDate"
                type="date"
                {...register("bookingDate")}
                min={new Date().toISOString().split('T')[0]}
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

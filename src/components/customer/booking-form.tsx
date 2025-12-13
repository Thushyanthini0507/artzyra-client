"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking, useUpdateBooking } from "@/hooks/useCustomerHooks";
import { useArtistPublicList } from "@/hooks/useApi";
import { Booking } from "@/types";
import { DatePicker } from "@/components/ui/date-picker";
import { Controller } from "react-hook-form";

const bookingSchema = z.object({
  artist: z.string().min(1, "Artist is required"),
  service: z.string().min(1, "Service is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  initialData?: Partial<Booking>;
  mode: "create" | "edit";
  bookingId?: string;
}

export function BookingForm({ initialData, mode, bookingId }: BookingFormProps) {
  const { createBooking, loading: creating } = useCreateBooking();
  const { updateBooking, loading: updating } = useUpdateBooking();
  const { artists, loading: loadingArtists } = useArtistPublicList();
  const loading = creating || updating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      artist: initialData?.artist as string || "",
      service: initialData?.service || "",
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
      time: "", // Add time default
      location: initialData?.location || "",
      specialRequests: initialData?.specialRequests || "",
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    // Combine date and time if needed by backend, or send separately
    // For now sending as is, assuming backend handles it or expects ISO string
    const bookingData = {
      ...data,
      date: new Date(`${data.date}T${data.time}`).toISOString(),
    };

    if (mode === "create") {
      await createBooking(bookingData);
    } else if (mode === "edit" && bookingId) {
      await updateBooking(bookingId, bookingData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="artist">Select Artist</Label>
        <select
          id="artist"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("artist")}
          disabled={mode === "edit" || loadingArtists}
        >
          <option value="">Select an artist</option>
          {artists.map((artist: any) => (
            <option key={artist._id} value={artist._id}>
              {artist.name} ({artist.category})
            </option>
          ))}
        </select>
        {errors.artist && <p className="text-sm text-red-500">{errors.artist.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service Type</Label>
        <Input id="service" placeholder="e.g. Portrait Painting" {...register("service")} />
        {errors.service && <p className="text-sm text-red-500">{errors.service.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                placeholder="Select a date"
              />
            )}
          />
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" {...register("time")} />
          {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" placeholder="e.g. 123 Main St, New York" {...register("location")} />
        {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea id="specialRequests" placeholder="Describe your requirements..." {...register("specialRequests")} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : mode === "create" ? "Create Booking" : "Update Booking"}
      </Button>
    </form>
  );
}

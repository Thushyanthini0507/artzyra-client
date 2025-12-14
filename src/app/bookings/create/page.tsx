"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { artistService } from "@/services/artist.service";
import { bookingService } from "@/services/booking.service";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Loader2, Calendar as CalendarIcon, Clock, MapPin, DollarSign, Info } from "lucide-react";
import { formatHourlyRate } from "@/lib/utils/currency";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";

// Base schema for common fields
const baseBookingSchema = z.object({
  service: z.string().min(1, "Service type is required").min(3, "Service type must be at least 3 characters"),
});

// Remote artist booking schema
const remoteBookingSchema = baseBookingSchema.extend({
  projectTitle: z.string().min(1, "Project title is required").min(3, "Project title must be at least 3 characters"),
  projectDescription: z.string().min(1, "Project description is required").min(20, "Project description must be at least 20 characters"),
  expectedDeliveryDate: z.string().optional(),
  // Optional fields for remote (not used but present for type compatibility)
  date: z.string().optional(),
  startTime: z.string().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

// Physical artist booking schema (for legacy support, though they shouldn't be bookable)
const physicalBookingSchema = baseBookingSchema.extend({
  date: z.string().min(1, "Booking date is required"),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.string().min(1, "Duration is required"),
  location: z.string().min(1, "Location is required").min(5, "Location must be at least 5 characters"),
  notes: z.string().optional(),
  // Optional fields for physical (not used but present for type compatibility)
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
});

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const artistId = searchParams.get("artistId");

  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Use a union schema that accepts both types
  const bookingSchema = z.union([remoteBookingSchema, physicalBookingSchema]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "",
      projectTitle: "",
      projectDescription: "",
      expectedDeliveryDate: "",
      date: "",
      startTime: "",
      duration: "1",
      location: "",
      notes: "",
    },
  });

  const formData = watch();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to book an artist");
      router.push(`/auth/login?redirect=/bookings/create?artistId=${artistId}`);
      return;
    }

    if (user && user.role !== "customer") {
      toast.error("Only customers can book artists");
      router.push("/browse");
      return;
    }

    const fetchArtist = async () => {
      if (!artistId) {
        toast.error("No artist selected");
        router.push("/browse");
        return;
      }

      try {
        const response = await artistService.getById(artistId);
        if (response.success) {
          const artistData = response.data;
          
          // Check if artist is physical - they should not be booked here
          if (artistData.artistType === 'physical') {
            toast.error("Physical artists cannot be booked directly. Please chat with them first.");
            router.push(`/chat?artistId=${artistId}`);
            return;
          }
          
          setArtist(artistData);
          
          // Reset form with proper defaults when artist loads
          reset({
            service: "",
            projectTitle: "",
            projectDescription: "",
            expectedDeliveryDate: "",
            date: "",
            startTime: "",
            duration: "1",
            location: "",
            notes: "",
          });
        } else {
          toast.error("Artist not found");
          router.push("/browse");
        }
      } catch (error) {
        console.error("Error fetching artist:", error);
        toast.error("Failed to load artist details");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchArtist();
    }
  }, [artistId, user, authLoading, router]);

  // Update form when artist changes
  useEffect(() => {
    if (artist) {
      setValue("service", formData.service || "");
    }
  }, [artist, setValue]);

  const calculateTotal = () => {
    if (!artist) return 0;
    
    if (artist.artistType === 'remote') {
      // If artist has services array, find the selected service price
      if (artist.services && artist.services.length > 0 && formData.service) {
        const selectedService = artist.services.find((s: any) => s.name === formData.service);
        if (selectedService) {
          return selectedService.price;
        }
      }
      // Fallback to pricing or hourlyRate
      return artist.pricing?.amount || artist.hourlyRate || 0;
    }
    
    const duration = parseFloat(formData.duration || "0") || 0;
    return duration * (artist.hourlyRate || 0);
  };

  const getSelectedServiceDeliveryTime = () => {
    if (!artist || !artist.services || artist.services.length === 0) {
      return artist?.deliveryTime || 3;
    }
    if (formData.service) {
      const selectedService = artist.services.find((s: any) => s.name === formData.service);
      if (selectedService) {
        return selectedService.deliveryTime;
      }
    }
    return artist.deliveryTime || 3;
  };

  const onSubmit = async (data: any) => {
    // Validate based on artist type
    if (artist.artistType === 'remote') {
      if (!data.service || !data.projectTitle || !data.projectDescription) {
        toast.error("Please fill in all required fields for remote booking");
        return;
      }
    } else {
      if (!data.service || !data.date || !data.startTime || !data.location) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    setSubmitting(true);

    if (!artist.userId) {
      toast.error("Cannot book this artist: Invalid profile data (missing User ID)");
      setSubmitting(false);
      return;
    }

    try {
      let bookingData: any;
      
      if (artist.artistType === 'remote') {
        // Remote artist booking format
        const deliveryDays = getSelectedServiceDeliveryTime();
        const expectedDate = data.expectedDeliveryDate 
          ? new Date(data.expectedDeliveryDate)
          : new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000);
        
        // Get service price if services array exists
        let servicePrice = calculateTotal();
        if (artist.services && artist.services.length > 0 && data.service) {
          const selectedService = artist.services.find((s: any) => s.name === data.service);
          if (selectedService) {
            servicePrice = selectedService.price;
          }
        }
        
        bookingData = {
          artistId: artist.userId,
          service: data.service,
          projectTitle: data.projectTitle,
          projectDescription: data.projectDescription,
          expectedDeliveryDate: expectedDate.toISOString(),
          pricingType: "package",
          packagePrice: servicePrice,
          paymentType: "full",
          urgency: "normal",
          deliveryDays: deliveryDays, // Store delivery days from selected service
          // Legacy fields for backward compatibility
          bookingDate: new Date().toISOString().split('T')[0],
          startTime: "09:00",
          duration: 1,
          location: "Remote / Online",
          notes: data.projectDescription,
          totalAmount: servicePrice,
        };
      } else {
        // Physical artist booking format (legacy - but shouldn't reach here for remote)
        bookingData = {
          artistId: artist.userId,
          service: data.service,
          bookingDate: data.date,
          startTime: data.startTime,
          duration: parseFloat(data.duration),
          location: data.location,
          notes: data.notes || "",
          totalAmount: calculateTotal(),
        };
      }

      const response = await bookingService.create(bookingData);

      if (response.success) {
        toast.success("Booking created! Proceeding to payment...");
        router.push(`/bookings/${response.data._id}/payment`); 
      } else {
        toast.error(response.message || "Failed to create booking");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  if (!artist) return null;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Complete Your Booking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1e1b29] border-white/10 text-white">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill in the details for your appointment with {artist.name}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {artist.artistType === 'remote' ? (
                    <div className="space-y-4">
                      <div className="bg-[#5b21b6]/20 p-4 rounded-lg flex gap-3 items-start border border-[#5b21b6]/30">
                        <Info className="h-5 w-5 text-[#9b87f5] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm mb-1">Remote Service</h4>
                          <p className="text-xs text-gray-300 leading-relaxed">
                            This is a remote service. Delivery will be within {artist.deliveryTime || 3} days.
                            Please describe your requirements in detail below.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service">Service Type *</Label>
                        {artist.services && artist.services.length > 0 ? (
                          <Controller
                            name="service"
                            control={control}
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={`bg-[#13111c] border-white/10 text-white focus:ring-[#9b87f5] ${errors.service ? "border-red-500" : ""}`}>
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1b29] border-white/10 text-white">
                                  {artist.services.map((service: any, index: number) => (
                                    <SelectItem 
                                      key={index} 
                                      value={service.name}
                                      className="focus:bg-[#5b21b6] focus:text-white"
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span>{service.name}</span>
                                        <span className="ml-4 text-[#a78bfa] text-sm">
                                          {formatHourlyRate(service.price)} • {service.deliveryTime} {service.deliveryTime === 1 ? 'day' : 'days'}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        ) : (
                          <Input
                            id="service"
                            {...register("service")}
                            placeholder="e.g., Logo Design, Video Editing, Web Development"
                            className={`bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5] ${errors.service ? "border-red-500" : ""}`}
                          />
                        )}
                        {errors.service && (
                          <p className="text-sm text-red-500 mt-1">{errors.service.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectTitle">Project Title *</Label>
                        <Input
                          id="projectTitle"
                          {...register("projectTitle")}
                          placeholder="e.g., Company Logo Design"
                          className={`bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5] ${errors.projectTitle ? "border-red-500" : ""}`}
                        />
                        {errors.projectTitle && (
                          <p className="text-sm text-red-500 mt-1">{errors.projectTitle.message as string}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="projectDescription">Project Details & Requirements *</Label>
                        <Textarea
                          id="projectDescription"
                          {...register("projectDescription")}
                          placeholder="Describe your project, style preferences, and any specific requirements..."
                          className={`bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5] min-h-[150px] ${errors.projectDescription ? "border-red-500" : ""}`}
                        />
                        {errors.projectDescription && (
                          <p className="text-sm text-red-500 mt-1">{errors.projectDescription.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                        <Controller
                          name="expectedDeliveryDate"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              value={field.value ? new Date(field.value) : undefined}
                              onChange={(date) => {
                                field.onChange(date?.toISOString().split('T')[0] || "");
                              }}
                              placeholder="Select expected delivery date (optional)"
                              className="bg-[#13111c] border-white/10"
                            />
                          )}
                        />
                        <p className="text-xs text-gray-400">
                          Default: {getSelectedServiceDeliveryTime()} days from today
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="service">Service Type *</Label>
                        <Input
                          id="service"
                          {...register("service")}
                          placeholder="e.g., Photography, Videography"
                          className={`bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5] ${errors.service ? "border-red-500" : ""}`}
                        />
                        {errors.service && (
                          <p className="text-sm text-red-500 mt-1">{errors.service.message as string}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date *</Label>
                          <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                value={field.value ? new Date(field.value) : undefined}
                                onChange={(date) => field.onChange(date?.toISOString().split('T')[0] || '')}
                                placeholder="Select booking date"
                                className={`bg-[#13111c] border-white/10 ${errors.date ? "border-red-500" : ""}`}
                              />
                            )}
                          />
                          {errors.date && (
                            <p className="text-sm text-red-500 mt-1">{errors.date.message as string}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time *</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="startTime"
                              type="time"
                              {...register("startTime")}
                              className={`pl-10 bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5] ${errors.startTime ? "border-red-500" : ""}`}
                            />
                          </div>
                          {errors.startTime && (
                            <p className="text-sm text-red-500 mt-1">{errors.startTime.message as string}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (Hours) *</Label>
                        <Controller
                          name="duration"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className={`bg-[#13111c] border-white/10 text-white focus:ring-[#9b87f5] ${errors.duration ? "border-red-500" : ""}`}>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1e1b29] border-white/10 text-white">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                  <SelectItem key={num} value={num.toString()} className="focus:bg-[#5b21b6] focus:text-white">
                                    {num} {num === 1 ? "Hour" : "Hours"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.duration && (
                          <p className="text-sm text-red-500 mt-1">{errors.duration.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="location"
                            {...register("location")}
                            placeholder="Enter full address"
                            className={`pl-10 bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5] ${errors.location ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.location && (
                          <p className="text-sm text-red-500 mt-1">{errors.location.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          {...register("notes")}
                          placeholder="Describe your project or any specific requirements..."
                          className="bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5] min-h-[100px]"
                        />
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg rounded-xl"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-[#1e1b29] border-white/10 text-white sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                  <Avatar className="h-16 w-16 border-2 border-[#9b87f5]">
                    <AvatarImage src={artist.profileImage} />
                    <AvatarFallback>{artist.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{artist.name}</h3>
                    <p className="text-[#a78bfa] text-sm">{artist.category?.name || "Artist"}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {artist.artistType === 'remote' && formData.service && artist.services && artist.services.length > 0 ? (
                    <>
                      <div className="flex justify-between text-gray-400">
                        <span>Selected Service</span>
                        <span className="text-white">{formData.service}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Service Price</span>
                        <span className="text-white">{formatHourlyRate(calculateTotal())}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Delivery Time</span>
                        <span className="text-white">{getSelectedServiceDeliveryTime()} {getSelectedServiceDeliveryTime() === 1 ? 'Day' : 'Days'}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-gray-400">
                        <span>{artist.artistType === 'remote' ? 'Service Price' : 'Hourly Rate'}</span>
                        <span className="text-white">
                          {artist.artistType === 'remote' && artist.pricing?.amount 
                            ? formatHourlyRate(artist.pricing.amount) 
                            : formatHourlyRate(artist.hourlyRate)
                          }
                        </span>
                      </div>
                      {artist.artistType !== 'remote' && (
                        <div className="flex justify-between text-gray-400">
                          <span>Duration</span>
                          <span className="text-white">{formData.duration} {parseFloat(formData.duration || "0") === 1 ? "hour" : "hours"}</span>
                        </div>
                      )}
                      {artist.artistType === 'remote' && (
                        <div className="flex justify-between text-gray-400">
                          <span>Delivery Time</span>
                          <span className="text-white">{getSelectedServiceDeliveryTime()} Days</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>Service Fee</span>
                    <span className="text-white">$0.00</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center font-bold text-xl">
                    <span>Total</span>
                    <span className="text-[#9b87f5]">{formatHourlyRate(calculateTotal())}</span>
                  </div>
                </div>

                <div className="bg-[#5b21b6]/20 p-4 rounded-lg flex gap-3 items-start">
                  <Info className="h-5 w-5 text-[#9b87f5] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300 leading-relaxed">
                    You won't be charged until you confirm your payment details on the next step.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateBookingPage() {
  return (
    <PublicLayout>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
        </div>
      }>
        <BookingForm />
      </Suspense>
    </PublicLayout>
  );
}

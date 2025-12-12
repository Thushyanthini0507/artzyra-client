"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const artistId = searchParams.get("artistId");

  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    duration: "1",
    location: "",
    notes: "",
    service: "Custom Service", // Default or selectable
  });

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
          setArtist(response.data);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (!artist) return 0;
    const duration = parseFloat(formData.duration) || 0;
    return duration * (artist.hourlyRate || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.startTime || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        artistId: artist._id,
        service: formData.service,
        bookingDate: formData.date,
        startTime: formData.startTime,
        duration: parseFloat(formData.duration),
        location: formData.location,
        notes: formData.notes,
        totalAmount: calculateTotal(),
      };

      const response = await bookingService.create(bookingData);

      if (response.success) {
        toast.success("Booking created successfully!");
        // Redirect to payment page (to be implemented)
        // For now, redirect to booking details or dashboard
        // router.push(`/bookings/${response.data._id}/payment`); 
        // Since payment page isn't ready, we'll go to dashboard or show success
        toast.info("Redirecting to payment...");
        // router.push(`/bookings/${response.data._id}/payment`);
        // Temporary redirect until payment page is built
        router.push("/customer"); 
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={formData.date}
                          onChange={handleInputChange}
                          className="pl-10 bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5]"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="startTime"
                          name="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="pl-10 bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (Hours)</Label>
                    <Select 
                      value={formData.duration} 
                      onValueChange={(val) => handleSelectChange("duration", val)}
                    >
                      <SelectTrigger className="bg-[#13111c] border-white/10 text-white focus:ring-[#9b87f5]">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        name="location"
                        placeholder="Enter full address"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="pl-10 bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Describe your project or any specific requirements..."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="bg-[#13111c] border-white/10 text-white focus:border-[#9b87f5] min-h-[100px]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#9b87f5] hover:bg-[#8a76d6] text-white font-bold py-6 text-lg rounded-xl"
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
                  <div className="flex justify-between text-gray-400">
                    <span>Hourly Rate</span>
                    <span className="text-white">{formatHourlyRate(artist.hourlyRate)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Duration</span>
                    <span className="text-white">{formData.duration} {parseFloat(formData.duration) === 1 ? "hour" : "hours"}</span>
                  </div>
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

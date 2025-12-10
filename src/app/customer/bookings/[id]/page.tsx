"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types/booking";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { 
  BookingHeader, 
  BookingInfo, 
  LocationCard, 
  PricingSummary, 
  ArtistCard, 
  BookingTimeline 
} from "@/components/customer/booking-components";
import { PaymentDialog } from "@/components/customer/PaymentDialog";
import { ReviewDialog } from "@/components/customer/ReviewDialog";
import { useDeleteBooking, useUpdateBooking } from "@/hooks/useCustomerHooks";
import { Button } from "@/components/ui/button";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { deleteBooking } = useDeleteBooking();
  const { updateBooking } = useUpdateBooking();

  const fetchBooking = async () => {
    try {
      const data = await bookingService.getBookingById(id);
      setBooking(data.data);
    } catch (error) {
      console.error("Failed to fetch booking", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!booking) return;
    
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      return;
    }

    if (booking.status === 'pending') {
      // If pending, we can delete it
      await deleteBooking(booking._id, () => {
        router.push('/customer/bookings');
      });
    } else {
      // If accepted, we cancel it
      await updateBooking(booking._id, { status: 'cancelled' });
      fetchBooking();
    }
  };

  const handleContact = () => {
    // Placeholder for messaging
    toast.info("Messaging feature coming soon!");
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </CustomerLayout>
    );
  }

  if (!booking) {
    return (
      <CustomerLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <h2 className="text-2xl font-bold">Booking not found</h2>
          <Button onClick={() => router.push('/customer/bookings')}>
            Back to Bookings
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <main className="flex-1 p-8 overflow-y-auto h-full">
        <div className="max-w-6xl mx-auto space-y-8">
          <BookingHeader id={booking._id} status={booking.status} />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <BookingInfo 
                service={booking.service}
                date={booking.bookingDate || booking.date || ""}
                startTime={booking.startTime}
                endTime={booking.endTime}
                duration="4 Hours" // Mock duration for now
              />

              <Card className="bg-[#1e1b29] border-white/5 shadow-lg">
                <CardContent className="pt-6">
                  <LocationCard address={booking.location} />
                </CardContent>
              </Card>

              {booking.specialRequests && (
                <Card className="bg-[#1e1b29] border-white/5 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Special Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 italic">
                      "{booking.specialRequests}"
                    </p>
                  </CardContent>
                </Card>
              )}

              <PricingSummary totalAmount={booking.totalAmount} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <ArtistCard 
                artist={booking.artist} 
                bookingStatus={booking.status}
                onContact={handleContact}
                onCancel={handleCancel}
              />

              {booking.status === 'accepted' && (
                <Card className="bg-[#1e1b29] border-[#5b21b6]/30 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Action Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400 mb-4">
                      Your booking has been accepted. Please proceed with payment to confirm.
                    </p>
                    <Button className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white" onClick={() => setIsPaymentOpen(true)}>
                      Pay Now
                    </Button>
                  </CardContent>
                </Card>
              )}

              {booking.status === 'completed' && (
                <Card className="bg-[#1e1b29] border-white/5 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full border-white/10 text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsReviewOpen(true)}>
                      Leave a Review
                    </Button>
                  </CardContent>
                </Card>
              )}

              <BookingTimeline 
                status={booking.status} 
                createdAt={booking.createdAt} 
                updatedAt={booking.updatedAt} 
              />
            </div>
          </div>

          <PaymentDialog 
            open={isPaymentOpen} 
            onOpenChange={setIsPaymentOpen} 
            booking={booking} 
            onSuccess={() => {
              fetchBooking();
              toast.success("Payment successful!");
            }} 
          />

          <ReviewDialog 
            open={isReviewOpen} 
            onOpenChange={setIsReviewOpen} 
            booking={booking} 
            onSuccess={() => {
              fetchBooking();
              toast.success("Review submitted!");
            }} 
          />
        </div>
      </main>
    </CustomerLayout>
  );
}

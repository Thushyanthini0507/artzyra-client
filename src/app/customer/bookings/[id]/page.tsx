"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/lib/api/services/bookingService";
import { PaymentForm } from "@/components/customer/payment-form";
import { ReviewForm } from "@/components/customer/review-form";
import { Booking } from "@/types";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatLKR } from "@/lib/utils/currency";

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const data = await bookingService.getBookingById(id);
      setBooking(data.data);
    } catch (error) {
      console.error("Failed to fetch booking", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  if (loading) return <CustomerLayout>Loading...</CustomerLayout>;
  if (!booking) return <CustomerLayout>Booking not found</CustomerLayout>;

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
            {booking.status}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Service Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Service</h3>
                <p>{booking.service}</p>
              </div>
              <div>
                <h3 className="font-semibold">Date & Time</h3>
                <p>{new Date(booking.date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p>{booking.location}</p>
              </div>
              <div>
                <h3 className="font-semibold">Total Amount</h3>
                <p className="text-xl font-bold">{formatLKR(booking.totalAmount)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payment">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="review">Review</TabsTrigger>
                </TabsList>
                <TabsContent value="payment">
                  <div className="mt-4">
                    <h3 className="mb-4 font-semibold">Make Payment</h3>
                    <PaymentForm 
                      bookingId={booking._id} 
                      amount={booking.totalAmount} 
                      onSuccess={fetchBooking}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="review">
                  <div className="mt-4">
                    <h3 className="mb-4 font-semibold">Leave a Review</h3>
                    <ReviewForm 
                      bookingId={booking._id} 
                      artistId={typeof booking.artist === 'string' ? booking.artist : booking.artist._id}
                      onSuccess={fetchBooking}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { BookingForm } from "@/components/customer/booking-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingService } from "@/lib/api/services/bookingService";
import { Booking } from "@/types";
import { useParams } from "next/navigation";

export default function EditBookingPage() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    if (id) fetchBooking();
  }, [id]);

  if (loading) return <CustomerLayout>Loading...</CustomerLayout>;
  if (!booking) return <CustomerLayout>Booking not found</CustomerLayout>;

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Edit Booking</CardTitle>
            <CardDescription>Update your booking details</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm mode="edit" bookingId={id} initialData={booking} />
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}

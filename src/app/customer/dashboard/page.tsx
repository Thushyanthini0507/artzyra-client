"use client";

import { CustomerLayout } from "@/components/layout/customer-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerBookings, useDeleteBooking } from "@/hooks/useCustomerHooks";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";

export default function CustomerDashboard() {
  const { bookings, loading, refresh } = useCustomerBookings();
  const { deleteBooking } = useDeleteBooking();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      await deleteBooking(id, refresh);
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookings</p>
          </div>
          <Link href="/customer/bookings/create">
            <Button>Create New Booking</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>View and manage upcoming appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-muted-foreground">No bookings found.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between border p-4 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{booking.service}</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.bookingDate || booking.date ? new Date(booking.bookingDate || booking.date!).toLocaleDateString() : "Date not set"} at {booking.location}
                      </p>
                      <Badge variant={booking.status === "completed" ? "default" : "secondary"} className="mt-2">
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/customer/bookings/${booking._id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/customer/bookings/${booking._id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(booking._id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}

"use client";

import { useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerBookings, useDeleteBooking } from "@/hooks/useCustomerHooks";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Eye, CreditCard, Star } from "lucide-react";
import { PaymentDialog } from "@/components/customer/PaymentDialog";
import { ReviewDialog } from "@/components/customer/ReviewDialog";

export default function CustomerBookingsPage() {
  const { bookings, loading, refresh } = useCustomerBookings();
  const { deleteBooking } = useDeleteBooking();
  
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      await deleteBooking(id, refresh);
    }
  };

  const handlePay = (booking: any) => {
    setSelectedBooking(booking);
    setIsPaymentOpen(true);
  };

  const handleReview = (booking: any) => {
    setSelectedBooking(booking);
    setIsReviewOpen(true);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">Manage your appointments and services</p>
          </div>
          <Link href="/customer/bookings/create">
            <Button>Book an Artist</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>A list of all your scheduled and past bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
                <Link href="/customer/bookings/create">
                  <Button>Book Your First Artist</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="flex flex-col md:flex-row md:items-center justify-between border p-4 rounded-lg gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.service}</h3>
                      <p className="text-sm text-muted-foreground">
                        with <span className="font-medium text-foreground">{typeof booking.artist === 'object' ? booking.artist.name : 'Artist'}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{booking.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={booking.status === "completed" ? "default" : booking.status === "accepted" ? "secondary" : "outline"} className="capitalize">
                          {booking.status}
                        </Badge>
                        {booking.totalAmount && (
                          <span className="text-sm font-medium ml-2">${booking.totalAmount}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {booking.status === "accepted" && (
                        <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => handlePay(booking)}>
                          <CreditCard className="h-4 w-4" /> Pay Now
                        </Button>
                      )}
                      {booking.status === "completed" && (
                        <Button size="sm" variant="secondary" className="gap-2" onClick={() => handleReview(booking)}>
                          <Star className="h-4 w-4" /> Review
                        </Button>
                      )}
                      
                      <div className="flex gap-2">
                        <Link href={`/customer/bookings/${booking._id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" /> View
                          </Button>
                        </Link>
                        {booking.status === "pending" && (
                          <>
                            <Link href={`/customer/bookings/${booking._id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(booking._id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <PaymentDialog 
          open={isPaymentOpen} 
          onOpenChange={setIsPaymentOpen} 
          booking={selectedBooking} 
          onSuccess={() => {
            refresh();
            // Optional: redirect to payments page or show success toast (handled in dialog)
          }} 
        />

        <ReviewDialog 
          open={isReviewOpen} 
          onOpenChange={setIsReviewOpen} 
          booking={selectedBooking} 
          onSuccess={() => {
            refresh();
            // Optional: redirect to reviews page or show success toast (handled in dialog)
          }} 
        />
      </div>
    </CustomerLayout>
  );
}

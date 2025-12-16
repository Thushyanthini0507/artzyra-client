"use client";

import { useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerBookings, useDeleteBooking } from "@/hooks/useCustomerHooks";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Eye, CreditCard, Star, MessageSquare } from "lucide-react";
import { PaymentDialog } from "@/components/customer/PaymentDialog";
import { ReviewDialog } from "@/components/customer/ReviewDialog";
import { formatLKR } from "@/lib/utils/currency";

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
      <main className="flex-1 p-8 overflow-y-auto h-full">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white">My Bookings</h1>
              <p className="text-gray-400">Manage your appointments and services</p>
            </div>
          </div>

          <Card className="bg-[#1e1b29] border-white/5 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">All Bookings</CardTitle>
              <CardDescription className="text-gray-400">A list of all your scheduled and past bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-400">Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-4">You haven't made any bookings yet.</p>
                  <Link href="/customer/bookings/create">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">Book Your First Artist</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="flex flex-col md:flex-row md:items-center justify-between bg-[#13111c] border border-white/5 p-6 rounded-2xl gap-6 hover:border-[#5b21b6]/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h3 className="font-bold text-lg text-white">{booking.service}</h3>
                            <Badge 
                              variant="outline" 
                              className={`capitalize border ${
                                booking.status === "confirmed" 
                                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                                  : booking.status === "in_progress" 
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : booking.status === "declined"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : booking.status === "completed" 
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : booking.status === "cancelled"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              }`}
                            >
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          with <span className="font-medium text-white">{(booking.artist as any)?.name ?? "Artist"}</span>
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {booking.bookingDate ? (
                            <>
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5b21b6]"></span>
                                {new Date(booking.bookingDate).toLocaleDateString()}
                              </span>
                              {booking.startTime && booking.endTime && (
                                <>
                                  <span>•</span>
                                  <span>{booking.startTime} - {booking.endTime}</span>
                                </>
                              )}
                            </>
                          ) : booking.date ? (
                            <>
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5b21b6]"></span>
                                {new Date(booking.date).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>{new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </>
                          ) : (
                            <span className="text-gray-500">Date not set</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{booking.location}</p>
                        {booking.totalAmount && (
                           <p className="text-[#a78bfa] font-semibold mt-2">{formatLKR(booking.totalAmount)}</p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        {booking.status === "pending" && (
                          <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl" onClick={() => handlePay(booking)}>
                            <CreditCard className="h-4 w-4" /> Pay Now
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <Button size="sm" variant="secondary" className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl" onClick={() => handleReview(booking)}>
                            <Star className="h-4 w-4" /> Review
                          </Button>
                        )}
                        {/* Show Chat button for paid bookings (in_progress, review, completed) or any booking with payment succeeded */}
                        {(booking.paymentStatus === "succeeded" || ["in_progress", "review", "completed"].includes(booking.status)) && booking.status !== "cancelled" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl"
                            onClick={() => {
                              const artist = booking.artist as any;
                              const artistId = typeof artist === 'object' 
                                ? (artist._id || artist.userId?._id || artist.userId)
                                : artist;
                              if (artistId) {
                                window.location.href = `/chat?artistId=${artistId}`;
                              } else {
                                window.location.href = `/chat?bookingId=${booking._id}`;
                              }
                            }}
                          >
                            <MessageSquare className="h-4 w-4" /> Chat
                          </Button>
                        )}
                        
                        <div className="flex gap-2">
                          <Link href={`/customer/bookings/${booking._id}`}>
                            <Button variant="outline" size="sm" className="gap-2 border-white/10 text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl">
                              <Eye className="h-4 w-4" /> View
                            </Button>
                          </Link>
                          {booking.status === "pending" && (
                            <>
                              <Link href={`/customer/bookings/${booking._id}/edit`}>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(booking._id)} className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl">
                                <Trash2 className="h-4 w-4" />
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
            }} 
          />

          <ReviewDialog 
            open={isReviewOpen} 
            onOpenChange={setIsReviewOpen} 
            booking={selectedBooking} 
            onSuccess={() => {
              refresh();
            }} 
          />
        </div>
      </main>
    </CustomerLayout>
  );
}

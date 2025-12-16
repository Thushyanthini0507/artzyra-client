"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/services/booking.service";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Loader2, Calendar, Clock, MapPin, DollarSign, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { formatHourlyRate } from "@/lib/utils/currency";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

import { BookingStatus } from "@/types/booking";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBooking = async () => {
    try {
      const response = await bookingService.getById(bookingId);
      if (response.success) {
        setBooking(response.data);
      } else {
        toast.error("Booking not found");
        router.push("/customer");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handleStatusUpdate = async (status: BookingStatus) => {
    setActionLoading(true);
    try {
      const response = await bookingService.update(bookingId, { status });
      if (response.success) {
        toast.success(`Booking ${status} successfully`);
        fetchBooking();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteBooking = async () => {
    setActionLoading(true);
    try {
      // Assuming we have a specific endpoint for completion or just use update
      const { default: apiClient } = await import("@/lib/apiClient");
      const response = await apiClient.post(`/bookings/${bookingId}/complete`);
      
      if (response.data.success) {
        toast.success("Booking marked as completed");
        fetchBooking();
      } else {
        toast.error(response.data.message || "Failed to complete booking");
      }
    } catch (error) {
      console.error("Error completing booking:", error);
      toast.error("Failed to complete booking");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
        </div>
      </PublicLayout>
    );
  }

  if (!booking) return null;

  const isCustomer = user?.role === "customer";
  const isArtist = user?.role === "artist";
  const otherParty = isCustomer ? booking.artist : booking.customer;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "confirmed": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in_progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "declined": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Booking Details</h1>
              <p className="text-gray-400">ID: {booking._id}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`px-3 py-1 text-sm border ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <Badge className={`px-3 py-1 text-sm border ${booking.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#1e1b29] border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Service Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-400">Service Type</label>
                      <p className="font-medium text-lg">{booking.service}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-400">Date & Time</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#9b87f5]" />
                        <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 text-[#9b87f5] ml-2" />
                        <span>{booking.startTime} ({booking.duration} hrs)</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-400">Location</label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#9b87f5]" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-400">Total Amount</label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#9b87f5]" />
                        <span className="font-bold text-lg">{formatHourlyRate(booking.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="pt-4 border-t border-white/10">
                      <label className="text-sm text-gray-400 block mb-2">Additional Notes</label>
                      <p className="text-gray-300 bg-[#13111c] p-4 rounded-lg text-sm">
                        {booking.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                {/* Payment Action */}
                {isCustomer && booking.paymentStatus === "pending" && booking.status !== "cancelled" && booking.status !== "declined" && (
                  <Button 
                    className="bg-[#9b87f5] hover:bg-[#8a76d6] text-white"
                    onClick={() => router.push(`/bookings/${bookingId}/payment`)}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pay Now
                  </Button>
                )}

                {/* Chat Action */}
                {(booking.status === "confirmed" || booking.status === "completed") && (
                  <Button 
                    variant="outline" 
                    className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
                    onClick={() => router.push(`/chat?bookingId=${bookingId}`)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message {isCustomer ? "Artist" : "Customer"}
                  </Button>
                )}

                {/* Artist Actions */}
                {isArtist && booking.status === "pending" && (
                  <>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleStatusUpdate("in_progress")}
                      disabled={actionLoading}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept Booking
                    </Button>
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleStatusUpdate("declined")}
                      disabled={actionLoading}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                  </>
                )}

                {isArtist && booking.status === "confirmed" && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleCompleteBooking}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}

                {/* Customer Actions */}
                {isCustomer && booking.status === "pending" && (
                  <Button 
                    variant="destructive"
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={actionLoading}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-[#1e1b29] border-white/10 text-white">
                <CardHeader>
                  <CardTitle>{isCustomer ? "Artist" : "Customer"} Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-2 border-[#9b87f5] mb-4">
                    <AvatarImage src={otherParty?.profileImage} />
                    <AvatarFallback>{otherParty?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-xl mb-1">{otherParty?.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{otherParty?.email}</p>
                  
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

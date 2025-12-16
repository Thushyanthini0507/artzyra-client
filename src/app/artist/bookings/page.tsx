"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { artistService } from "@/services/artist.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { formatLKR } from "@/lib/utils/currency";

export default function ArtistBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await artistService.getBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);


  const getStatusBadge = (status: string) => {
    const getStatusStyles = (status: string) => {
      const normalized = status.toLowerCase();
      
      switch (normalized) {
        case "confirmed":
        case "accepted":
        case "approved":
          return "bg-green-500/20 text-green-400 border-green-500/30";
        case "in_progress":
        case "in progress":
          return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        case "declined":
        case "rejected":
        case "failed":
          return "bg-red-500/20 text-red-400 border-red-500/30";
        case "completed":
        case "succeeded":
        case "paid":
          return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        case "pending":
        case "processing":
          return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        case "cancelled":
        case "canceled":
          return "bg-red-500/20 text-red-400 border-red-500/30";
        default:
          return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      }
    };

    return (
      <Badge 
        variant="outline" 
        className={`capitalize border ${getStatusStyles(status)}`}
      >
        {status}
      </Badge>
    );
  };

  return (

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Bookings</h1>
          <p className="text-gray-400">Manage your customer bookings</p>
        </div>

        <Card className="border-none bg-[#1e1b29]">
          <CardHeader>
            <CardTitle className="text-white">All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No bookings found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/10">
                    <TableHead className="text-gray-400">Customer</TableHead>
                    <TableHead className="text-gray-400">Service</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Location</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id} className="hover:bg-white/5 border-white/10">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-200">{booking.customer?.name || "N/A"}</div>
                          <div className="text-sm text-gray-400">{booking.customer?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{booking.service || "N/A"}</TableCell>
                      <TableCell className="text-gray-300">
                        {(() => {
                          // Try multiple date fields and format properly
                          const dateValue = booking.bookingDate || booking.date || booking.expectedDeliveryDate || booking.createdAt;
                          if (dateValue) {
                            try {
                              const date = new Date(dateValue);
                              // Check if date is valid
                              if (!isNaN(date.getTime())) {
                                return date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  timeZone: "UTC" // Use UTC to avoid timezone issues
                                });
                              }
                            } catch (e) {
                              console.error("Date parsing error:", e);
                            }
                          }
                          return "N/A";
                        })()}
                      </TableCell>
                      <TableCell className="text-gray-300">{booking.location || "Remote"}</TableCell>
                      <TableCell className="text-gray-300">{formatLKR(booking.totalAmount)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-gray-300">
                        {(() => {
                          // For remote bookings, show expected delivery date or created date
                          if (booking.startTime && booking.endTime) {
                            return `${booking.startTime} - ${booking.endTime}`;
                          } else if (booking.expectedDeliveryDate) {
                            const deliveryDate = new Date(booking.expectedDeliveryDate);
                            if (!isNaN(deliveryDate.getTime())) {
                              return `Expected: ${deliveryDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}`;
                            }
                          } else if (booking.createdAt) {
                            const createdDate = new Date(booking.createdAt);
                            if (!isNaN(createdDate.getTime())) {
                              return `Created: ${createdDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric"
                              })}`;
                            }
                          }
                          return "N/A";
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

  );
}

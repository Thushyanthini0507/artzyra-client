"use client";

import { useEffect, useState } from "react";
import { ArtistLayout } from "@/components/layout/artist-layout";
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
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      accepted: "default",
      rejected: "destructive",
      completed: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <ArtistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage your customer bookings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No bookings found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customer?.name || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{booking.customer?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.service || "N/A"}</TableCell>
                      <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.location || "N/A"}</TableCell>
                      <TableCell>{formatLKR(booking.totalAmount)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        {booking.startTime && booking.endTime 
                          ? `${booking.startTime} - ${booking.endTime}`
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ArtistLayout>
  );
}

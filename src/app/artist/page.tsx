"use client";

import { useEffect, useState } from "react";
import { ArtistLayout } from "@/components/layout/artist-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { artistService } from "@/lib/api/services/artistService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ArtistDashboard() {
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    revenue: 0,
    services: 1,
  });
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const bookingsResponse = await artistService.getBookings();
      if (bookingsResponse.success && bookingsResponse.data) {
        const bookings = bookingsResponse.data;
        const active = bookings.filter((b: any) => ["confirmed", "accepted"].includes(b.status)).length;
        const completed = bookings.filter((b: any) => b.status === "completed").length;
        const revenue = bookings
          .filter((b: any) => b.status === "completed")
          .reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0);
        
        // Get confirmed bookings (no pending since bookings auto-confirm)
        const confirmed = bookings.filter((b: any) => b.status === "confirmed");
        
        setStats({
          activeOrders: active,
          completedOrders: completed,
          revenue,
          services: 1,
        });
        setPendingBookings(confirmed.slice(0, 5)); // Show recent confirmed bookings
      }
    } catch (error) {
      console.error("Failed to fetch artist data", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <ArtistLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Artist Dashboard</h1>
            <p className="text-muted-foreground">Manage your services and orders</p>
          </div>
          <Badge variant="secondary">Approved</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>In progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
              <CardDescription>Total completed jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Total earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${stats.revenue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Confirmed</CardTitle>
              <CardDescription>Active bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{pendingBookings.length}</div>
            </CardContent>
          </Card>
        </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Your confirmed bookings</CardDescription>
                </div>
                <Link href="/artist/bookings">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : pendingBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No bookings yet</p>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBookings.slice(0, 5).map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customer?.name || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{booking.customer?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.service || "N/A"}</TableCell>
                      <TableCell>{new Date(booking.bookingDate || booking.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {booking.startTime && booking.endTime 
                          ? `${booking.startTime} - ${booking.endTime}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>${booking.totalAmount || 0}</TableCell>
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

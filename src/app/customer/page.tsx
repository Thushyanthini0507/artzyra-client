"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingService } from "@/lib/api/services/bookingService";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CustomerDashboard() {
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedBookings: 0,
    favorites: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsResponse = await bookingService.getCustomerBookings();
        if (bookingsResponse.success && bookingsResponse.data) {
          const bookings = bookingsResponse.data;
          const active = bookings.filter((b: any) => ["pending", "accepted"].includes(b.status)).length;
          const completed = bookings.filter((b: any) => b.status === "completed").length;
          
          setStats(prev => ({
            ...prev,
            activeBookings: active,
            completedBookings: completed,
          }));
          
          // Store recent bookings (top 5)
          setRecentBookings(bookings.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch customer data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
          </div>
          <Link href="/customer/bookings/create">
            <Button size="lg">Book an Artist</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Bookings</CardTitle>
              <CardDescription>Successfully finished</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favorites</CardTitle>
              <CardDescription>Saved artists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.favorites}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading activity...</p>
            ) : recentBookings.length === 0 ? (
              <p className="text-muted-foreground">No recent activity found.</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-semibold">{booking.service}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString()} at {booking.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                        {booking.status}
                      </Badge>
                      <Link href={`/customer/bookings/${booking._id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
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

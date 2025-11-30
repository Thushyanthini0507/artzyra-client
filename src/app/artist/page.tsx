"use client";

import { useEffect, useState } from "react";
import { ArtistLayout } from "@/components/layout/artist-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { artistService } from "@/lib/api/services/artistService";

export default function ArtistDashboard() {
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    revenue: 0,
    services: 1, // Usually 1 category
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsResponse = await artistService.getBookings();
        if (bookingsResponse.success && bookingsResponse.data) {
          const bookings = bookingsResponse.data;
          const active = bookings.filter((b: any) => ["pending", "accepted"].includes(b.status)).length;
          const completed = bookings.filter((b: any) => b.status === "completed").length;
          const revenue = bookings
            .filter((b: any) => b.status === "completed")
            .reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0);
          
          setStats(prev => ({
            ...prev,
            activeOrders: active,
            completedOrders: completed,
            revenue,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch artist data", error);
      } finally {
        setLoading(false);
      }
    };
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
              <CardTitle>Services</CardTitle>
              <CardDescription>Active listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.services}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer requests</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Check the Bookings tab for details</p>
          </CardContent>
        </Card>
      </div>
    </ArtistLayout>
  );
}

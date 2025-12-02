"use client";

import { useEffect, useState } from "react";
import { ArtistLayout } from "@/components/layout/artist-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { artistService } from "@/lib/api/services/artistService";
import { Loader2, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function ArtistEarningsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    completedBookings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await artistService.getBookings();
        if (response.success && response.data) {
          const allBookings = response.data;
          const completed = allBookings.filter((b: any) => b.status === "completed");
          const accepted = allBookings.filter((b: any) => b.status === "accepted");
          
          const totalEarnings = completed.reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0);
          const pendingEarnings = accepted.reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0);
          
          setBookings(completed);
          setStats({
            totalEarnings,
            pendingEarnings,
            completedBookings: completed.length,
          });
        }
      } catch (error) {
        console.error("Failed to fetch earnings", error);
        toast.error("Failed to load earnings data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ArtistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Earnings</h1>
          <p className="text-muted-foreground">Track your income and payments</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings}</div>
              <p className="text-xs text-muted-foreground">From {stats.completedBookings} completed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">${stats.pendingEarnings}</div>
              <p className="text-xs text-muted-foreground">From accepted bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <Badge variant="default">{stats.completedBookings}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All completed and paid bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No earnings yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customer?.name || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{booking.customer?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.service || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">${booking.totalAmount || 0}</TableCell>
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

"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { artistService } from "@/services/artist.service";
import { Loader2, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { formatLKR } from "@/lib/utils/currency";

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

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Earnings</h1>
          <p className="text-gray-400">Track your income and payments</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none bg-[#1e1b29]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatLKR(stats.totalEarnings)}</div>
              <p className="text-xs text-gray-400">From {stats.completedBookings} completed bookings</p>
            </CardContent>
          </Card>

          <Card className="border-none bg-[#1e1b29]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{formatLKR(stats.pendingEarnings)}</div>
              <p className="text-xs text-gray-400">From accepted bookings</p>
            </CardContent>
          </Card>

          <Card className="border-none bg-[#1e1b29]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completed Jobs</CardTitle>
              <Badge variant="default">{stats.completedBookings}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completedBookings}</div>
              <p className="text-xs text-gray-400">Total completed</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-[#1e1b29]">
          <CardHeader>
            <CardTitle className="text-white">Payment History</CardTitle>
            <CardDescription className="text-gray-400">All completed and paid bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No earnings yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/10">
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Customer</TableHead>
                    <TableHead className="text-gray-400">Service</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-right text-gray-400">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id} className="hover:bg-white/5 border-white/10">
                      <TableCell className="text-gray-300">{booking.bookingDate || booking.date ? new Date(booking.bookingDate || booking.date!).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-200">{booking.customer?.name || "N/A"}</div>
                          <div className="text-xs text-gray-400">{booking.customer?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{booking.service || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-gray-300">{formatLKR(booking.totalAmount)}</TableCell>
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

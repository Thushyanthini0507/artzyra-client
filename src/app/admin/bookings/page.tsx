"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatLKR } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RefreshCcw, Calendar, User, ShoppingBag } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch all bookings with a high limit to get complete count
      const response = await adminService.getBookings({ limit: 10000 });
      if (response.success && response.data) {
        // Handle both array and paginated response structure
        const bookingsArray = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || []);
        
        // Sort by date (newest first)
        const sortedBookings = (bookingsArray as any[]).sort((a, b) => {
          return new Date(b.bookingDate || b.createdAt).getTime() - new Date(a.bookingDate || a.createdAt).getTime();
        });
        setBookings(sortedBookings);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Helper function to get user display name
  const getUserDisplayName = (user: any): string => {
    if (!user) return "Unknown";
    // Try multiple possible name fields
    return user.name || user.fullName || user.firstName || user.email?.split('@')[0] || "Unknown";
  };

  // Helper function to normalize status for filtering
  const normalizeStatus = (status: string): string => {
    if (!status) return "";
    const normalized = status.toLowerCase().trim();
    
    // Map status variations to standard categories
    if (normalized === "pending" || normalized === "pending approval") {
      return "pending";
    }
    if (normalized === "confirmed" || normalized === "accepted" || normalized === "in_progress" || 
        normalized === "in progress" || normalized === "active" || normalized === "approved") {
      return "confirmed";
    }
    if (normalized === "completed" || normalized === "done" || normalized === "finished") {
      return "completed";
    }
    if (normalized === "cancelled" || normalized === "canceled") {
      return "cancelled";
    }
    if (normalized === "declined" || normalized === "rejected" || normalized === "failed") {
      return "declined";
    }
    
    return normalized;
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "all") {
      return matchesSearch;
    }
    
    const bookingStatus = normalizeStatus(booking.status || "");
    const matchesStatus = bookingStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts = {
      all: bookings.length,
      pending: bookings.filter(b => normalizeStatus(b.status || "") === "pending").length,
      confirmed: bookings.filter(b => normalizeStatus(b.status || "") === "confirmed").length,
      completed: bookings.filter(b => normalizeStatus(b.status || "") === "completed").length,
      cancelled: bookings.filter(b => normalizeStatus(b.status || "") === "cancelled").length,
      declined: bookings.filter(b => normalizeStatus(b.status || "") === "declined").length,
    };
    return counts;
  };

  const counts = getStatusCounts();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Bookings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all service bookings.
            </p>
          </div>
          <Button 
            onClick={fetchBookings} 
            variant="outline" 
            disabled={loading}
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30 text-white hover:text-white transition-all"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Bookings", count: counts.all, color: "bg-gray-500/20 text-gray-300" },
            { id: "pending", label: "Pending", count: counts.pending, color: "bg-yellow-500/20 text-yellow-400" },
            { id: "confirmed", label: "Confirmed", count: counts.confirmed, color: "bg-blue-500/20 text-blue-400" },
            { id: "completed", label: "Completed", count: counts.completed, color: "bg-emerald-500/20 text-emerald-400" },
            { id: "declined", label: "Declined", count: counts.declined, color: "bg-orange-500/20 text-orange-400" },
            { id: "cancelled", label: "Cancelled", count: counts.cancelled, color: "bg-red-500/20 text-red-400" },
          ].map((filter) => (
            <Button
              key={filter.id}
              variant="outline"
              size="sm"
              onClick={() => setStatusFilter(filter.id)}
              className={`border-white/10 transition-all ${
                statusFilter === filter.id 
                  ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-500" 
                  : "bg-black/20 hover:bg-white/5 text-gray-400"
              }`}
            >
              {filter.label}
              <Badge variant="secondary" className={`ml-2 ${filter.color} border-0`}>
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl text-white">Booking History</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ID, customer, or artist..."
                  className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-lg font-medium">No bookings found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-gray-300">Booking ID</TableHead>
                      <TableHead className="text-gray-300">Customer</TableHead>
                      <TableHead className="text-gray-300">Artist</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-right text-gray-300">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking._id} className="border-white/10 hover:bg-white/5 transition-colors">
                        <TableCell className="font-mono text-xs text-purple-300">
                          #{booking._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const customerName = getUserDisplayName(booking.customer);
                              const initial = customerName.charAt(0).toUpperCase();
                              return (
                                <>
                                  <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                                    {initial}
                                  </div>
                                  <span className="text-gray-200">{customerName}</span>
                                </>
                              );
                            })()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const artistName = getUserDisplayName(booking.artist);
                              const initial = artistName.charAt(0).toUpperCase();
                              return (
                                <>
                                  <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-400">
                                    {initial}
                                  </div>
                                  <span className="text-gray-200">{artistName}</span>
                                </>
                              );
                            })()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell className="text-right font-medium text-white">
                          {formatLKR(booking.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

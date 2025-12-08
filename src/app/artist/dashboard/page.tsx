"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ArtistLayoutNew } from "@/components/layout/artist-layout-new";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { artistService } from "@/services/artist.service";
import { toast } from "sonner";
import { Loader2, Calendar, TrendingUp, Eye, Edit, Eye as ViewIcon, DollarSign } from "lucide-react";
import Link from "next/link";
import { formatLKR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface Booking {
  _id: string;
  customer?: {
    name: string;
    email: string;
  };
  category?: {
    name: string;
  };
  bookingDate: string;
  startTime?: string;
  endTime?: string;
  status: string;
  totalAmount?: number;
}

export default function ArtistDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    upcomingBookings: 0,
    pendingRequests: 0,
    totalEarnings: 0,
    earningsChange: 0,
    profileViews: 0,
    profileViewsChange: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const [bookingsResponse, profileResponse] = await Promise.all([
        artistService.getBookings(),
        artistService.getProfile(),
      ]);

      if (bookingsResponse.success && bookingsResponse.data) {
        const bookings = bookingsResponse.data;
        const now = new Date();

        // Filter upcoming bookings (confirmed/accepted, date in future)
        const upcoming = bookings.filter((b: Booking) => {
          const bookingDate = new Date(b.bookingDate);
          return (
            ["confirmed", "accepted"].includes(b.status) &&
            bookingDate >= now
          );
        });

        // Filter pending requests
        const pending = bookings.filter(
          (b: Booking) => b.status === "pending"
        );

        // Calculate earnings (completed bookings)
        const completed = bookings.filter(
          (b: Booking) => b.status === "completed"
        );
        const earnings = completed.reduce(
          (acc: number, b: Booking) => acc + (b.totalAmount || 0),
          0
        );

        setStats({
          upcomingBookings: upcoming.length,
          pendingRequests: pending.length,
          totalEarnings: earnings,
          earningsChange: 15.2, // This would come from API
          profileViews: 1450, // This would come from API
          profileViewsChange: 8.5, // This would come from API
        });

        // Sort upcoming bookings by date and take first 2
        setUpcomingBookings(
          upcoming
            .sort(
              (a: Booking, b: Booking) =>
                new Date(a.bookingDate).getTime() -
                new Date(b.bookingDate).getTime()
            )
            .slice(0, 2)
        );
      }

      if (profileResponse.success && profileResponse.data) {
        setProfile(profileResponse.data.artist || profileResponse.data);
      }
    } catch (error) {
      console.error("Failed to fetch artist data", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/");
      } else {
        const userRole = (user.role || "").toLowerCase().trim();
        if (userRole !== "artist") {
          if (userRole === "admin") {
            router.replace("/admin");
          } else if (userRole === "customer") {
            router.replace("/customer");
          } else {
            router.replace("/");
          }
        } else {
          fetchData();
        }
      }
    }
  }, [user, authLoading, router, fetchData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
      case "accepted":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">Pending</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <ArtistLayoutNew>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </ArtistLayoutNew>
    );
  }

  if (!user || (user.role || "").toLowerCase().trim() !== "artist") {
    return null;
  }

  return (
    <ArtistLayoutNew>
      <div className="space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-4xl font-bold">
            {getGreeting()}, {user.name || "Artist"}!
          </h1>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.upcomingBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingRequests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings (Month)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatLKR(stats.totalEarnings)}
              </div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +{stats.earningsChange}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.profileViews}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +{stats.profileViewsChange}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Your Next Gigs */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Your Next Gigs</CardTitle>
              <CardDescription>Upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No upcoming bookings
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <p className="text-sm font-semibold">
                            {formatDate(booking.bookingDate)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">
                            {booking.customer?.name || "Unknown Client"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.category?.name || "Service"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(booking.status)}
                        <Link href={`/artist/bookings/${booking._id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Your Availability</CardTitle>
              <CardDescription>July 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Simple Calendar Widget */}
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={`day-${index}`} className="font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isToday = day === 24;
                    const isBooked = day === 28;
                    return (
                      <div
                        key={day}
                        className={cn(
                          "p-2 rounded-full cursor-pointer hover:bg-accent",
                          isToday && "bg-primary/10 text-primary font-semibold",
                          isBooked && "bg-primary text-primary-foreground font-semibold"
                        )}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/artist/calendar">Manage Full Calendar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Performance Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Quick Actions - Takes 1 column (Left side) */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/artist/profile">
                    <Edit className="h-5 w-5" />
                    <span>Edit Your Profile</span>
                  </Link>
                </Button>
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/artist/calendar">
                    <Calendar className="h-5 w-5" />
                    <span>Update Your Calendar</span>
                  </Link>
                </Button>
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2" asChild>
                  <Link href={`/artists/${user._id || ""}`}>
                    <ViewIcon className="h-5 w-5" />
                    <span>View Portfolio</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview - Takes 2 columns (Right side) */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Earnings (Last 30 Days)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ArtistLayoutNew>
  );
}

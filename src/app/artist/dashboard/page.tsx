"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ArtistLayoutNew } from "@/components/layout/artist-layout-new";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { artistService } from "@/services/artist.service";
import { toast } from "sonner";
import { 
  Loader2, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Edit, 
  DollarSign,
  Clock,
  MessageSquare,
  ChevronRight,
  User
} from "lucide-react";
import Link from "next/link";
import { formatLKR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface Booking {
  _id: string;
  customer?: {
    name: string;
    email: string;
    profileImage?: string;
  };
  category?: {
    name: string;
  };
  bookingDate: string;
  startTime?: string;
  endTime?: string;
  status: string;
  totalAmount?: number;
  service?: string;
}

interface Message {
  _id: string;
  customer?: {
    name: string;
    profileImage?: string;
  };
  lastMessage?: string;
  timestamp?: string;
  unread?: boolean;
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
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
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

        // Sort upcoming bookings by date and take first 5
        setUpcomingBookings(
          upcoming
            .sort(
              (a: Booking, b: Booking) =>
                new Date(a.bookingDate).getTime() -
                new Date(b.bookingDate).getTime()
            )
            .slice(0, 5)
        );
      }

      if (profileResponse.success && profileResponse.data) {
        setProfile(profileResponse.data.artist || profileResponse.data);
      }

      // Mock recent messages - this would come from a real API
      setRecentMessages([
        {
          _id: "1",
          customer: { name: "Sarah Johnson", profileImage: "" },
          lastMessage: "Hi! I'd like to book you for my wedding...",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          unread: true,
        },
        {
          _id: "2",
          customer: { name: "Michael Chen", profileImage: "" },
          lastMessage: "Thanks for the great session yesterday!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          unread: false,
        },
        {
          _id: "3",
          customer: { name: "Emma Davis", profileImage: "" },
          lastMessage: "Can we reschedule our appointment?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          unread: true,
        },
      ]);
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
      year: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    return timeString;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "confirmed" || statusLower === "accepted") {
      return (
        <Badge className="bg-[#059669]/20 text-[#34d399] hover:bg-[#059669]/30 border-none">
          Confirmed
        </Badge>
      );
    }
    if (statusLower === "pending") {
      return (
        <Badge className="bg-[#f59e0b]/20 text-[#fbbf24] hover:bg-[#f59e0b]/30 border-none">
          Pending
        </Badge>
      );
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (authLoading || loading) {
    return (
      <ArtistLayoutNew>
        <div className="flex items-center justify-center h-screen bg-[#13111c]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#a78bfa]" />
            <p className="text-gray-400">Loading dashboard...</p>
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
      <div className="flex-1 overflow-y-auto bg-[#13111c]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Greeting */}
            <div>
              <h1 className="text-4xl font-bold text-white">
                {getGreeting()}, {user.name || "Artist"}!
              </h1>
              <p className="text-gray-400 mt-2">Here's what's happening with your business today</p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-[#1e1b29] border-white/5 hover:border-[#5b21b6]/30 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-purple-900/30 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Upcoming Bookings
                  </CardTitle>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.upcomingBookings}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Confirmed appointments
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#1e1b29] border-white/5 hover:border-[#5b21b6]/30 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-purple-900/30 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Pending Requests
                  </CardTitle>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.pendingRequests}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Awaiting your response
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#1e1b29] border-white/5 hover:border-[#5b21b6]/30 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-purple-900/30 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Total Earnings
                  </CardTitle>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {formatLKR(stats.totalEarnings)}
                  </div>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +{stats.earningsChange}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#1e1b29] border-white/5 hover:border-[#5b21b6]/30 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-purple-900/30 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Profile Views</CardTitle>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.profileViews}</div>
                  <p className="text-xs text-purple-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +{stats.profileViewsChange}% this week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Bookings Section - Prominent */}
            <section className="bg-gradient-to-br from-[#1e1b29] to-[#13111c] rounded-3xl p-8 border border-white/5 shadow-xl shadow-black/30">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Your Next Gigs</h2>
                  <p className="text-gray-400">Upcoming appointments and bookings</p>
                </div>
                <Link href="/artist/bookings">
                  <Button className="bg-[#5b21b6] hover:bg-[#4c1d95] text-white border-none">
                    View All Bookings
                  </Button>
                </Link>
              </div>

              {upcomingBookings.length === 0 ? (
                <div className="text-center py-12 bg-[#13111c] rounded-2xl border border-white/5">
                  <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No upcoming bookings</p>
                  <p className="text-sm text-gray-500">Your confirmed appointments will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card
                      key={booking._id}
                      className="bg-[#13111c] border-white/5 hover:border-[#5b21b6]/30 transition-all duration-300 rounded-2xl"
                    >
                      <CardContent className="p-6 flex items-center gap-6">
                        <Avatar className="h-16 w-16 rounded-xl border-2 border-white/10">
                          <AvatarImage
                            src={booking.customer?.profileImage}
                            className="rounded-xl object-cover"
                          />
                          <AvatarFallback className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-semibold">
                            {getInitials(booking.customer?.name || "Guest")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-white mb-1 truncate">
                            {booking.service || booking.category?.name || "Service"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            with {booking.customer?.name || "Guest"}
                          </p>
                        </div>

                        <div className="text-right px-6 border-l border-white/5">
                          <p className="text-sm font-medium text-white mb-1">
                            {formatDate(booking.bookingDate)}
                          </p>
                          {(booking.startTime || booking.endTime) && (
                            <p className="text-xs text-gray-500">
                              {formatTime(booking.startTime)}
                              {booking.endTime && ` - ${formatTime(booking.endTime)}`}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          {getStatusBadge(booking.status)}
                          <Link href={`/artist/bookings/${booking._id}`}>
                            <Button className="bg-[#5b21b6] hover:bg-[#4c1d95] text-white border-none">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Messages Section */}
              <Card className="lg:col-span-2 bg-[#1e1b29] border-white/5 shadow-xl shadow-black/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Recent Messages</CardTitle>
                      <CardDescription className="text-gray-400">Latest conversations with clients</CardDescription>
                    </div>
                    <Link href="/artist/messages">
                      <Button variant="ghost" className="text-[#a78bfa] hover:text-white hover:bg-white/5">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentMessages.length === 0 ? (
                    <div className="text-center py-8 bg-[#13111c] rounded-xl">
                      <MessageSquare className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentMessages.map((message) => (
                        <Link
                          key={message._id}
                          href="/artist/messages"
                          className="block"
                        >
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#13111c] hover:bg-[#201d2e] transition-all border border-white/5 hover:border-[#5b21b6]/30">
                            <Avatar className="h-12 w-12 rounded-xl">
                              <AvatarImage
                                src={message.customer?.profileImage}
                                className="rounded-xl"
                              />
                              <AvatarFallback className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                                {getInitials(message.customer?.name || "U")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-white text-sm">
                                  {message.customer?.name || "Unknown"}
                                </p>
                                {message.unread && (
                                  <span className="h-2 w-2 bg-[#5b21b6] rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400 truncate">
                                {message.lastMessage}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {message.timestamp && getTimeAgo(message.timestamp)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-[#2e1065] to-[#1e1b29] border-white/5 shadow-xl shadow-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-300">Manage your artist profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/artist/profile">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-4 flex items-center justify-start gap-3 bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#5b21b6]/50 text-white transition-all"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <Edit className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-sm">Edit Profile</p>
                          <p className="text-xs text-gray-400">Update your information</p>
                        </div>
                      </Button>
                    </Link>

                    <Link href="/artist/calendar">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-4 flex items-center justify-start gap-3 bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#5b21b6]/50 text-white transition-all"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-sm">Manage Calendar</p>
                          <p className="text-xs text-gray-400">Set your availability</p>
                        </div>
                      </Button>
                    </Link>

                    <Link href={`/artists/${user._id || ""}`}>
                      <Button
                        variant="outline"
                        className="w-full h-auto py-4 flex items-center justify-start gap-3 bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#5b21b6]/50 text-white transition-all"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-sm">View Portfolio</p>
                          <p className="text-xs text-gray-400">See your public profile</p>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ArtistLayoutNew>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent } from "@/components/ui/card";
import { bookingService } from "@/services/booking.service";
import { artistService } from "@/services/artist.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotificationMenu } from "@/components/NotificationMenu";
import { Star, Search, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [featuredArtists, setFeaturedArtists] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured artists (top rated)
        const artistsResponse = await artistService.getAllArtists({ limit: 8, sort: "rating" });
        if (artistsResponse.success && artistsResponse.data) {
          setFeaturedArtists(artistsResponse.data);
        }

        // Fetch bookings
        const bookingsResponse = await bookingService.getCustomerBookings();
        if (bookingsResponse.success && bookingsResponse.data) {
          setBookings(bookingsResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch customer data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcomingBookings = bookings.filter((b: any) => 
    ["pending", "accepted", "confirmed"].includes(b.status?.toLowerCase())
  );
  const pastBookings = bookings.filter((b: any) => 
    ["completed", "cancelled"].includes(b.status?.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const formatDate = (booking: any) => {
    if (!booking.bookingDate) return "Date not set";
    const date = new Date(booking.bookingDate);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = booking.startTime && booking.endTime 
      ? `${booking.startTime} - ${booking.endTime}`
      : booking.startTime || "";
    return `${dateStr}${timeStr ? `, ${timeStr}` : ""}`;
  };

  const getStatusVariant = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "confirmed" || statusLower === "accepted") {
      return "default";
    }
    if (statusLower === "pending") {
      return "secondary";
    }
    if (statusLower === "completed") {
      return "default";
    }
    return "secondary";
  };

  return (
    <CustomerLayout>
      {/* Header Bar */}
      <header className="h-16 border-b bg-background flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold">Customer Dashboard</h1>
        
        <div className="flex items-center gap-4 flex-1 justify-center max-w-2xl mx-8">
          <Link href="/" className="text-xl font-bold">
            Artzyra
          </Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for painters, musicians, photographers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <NotificationMenu />
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="space-y-8">
          {/* Featured Artists Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Featured Artists</h2>
            {loading ? (
              <div className="text-muted-foreground">Loading artists...</div>
            ) : featuredArtists.length === 0 ? (
              <div className="text-muted-foreground">No featured artists available.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredArtists.map((artist) => (
                  <Card key={artist._id}>
                    <CardContent className="p-0">
                      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || "Artist")}&size=200&background=random`}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{artist.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {artist.category?.name || "Artist"}
                        </p>
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {artist.rating?.toFixed(1) || "0.0"} ({artist.reviewCount || 0} reviews)
                          </span>
                        </div>
                        <Link href={`/artists/${artist._id}`}>
                          <Button className="w-full" variant="outline">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* My Bookings Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">My Bookings</h2>
            </div>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {loading ? (
                  <div className="text-muted-foreground">Loading bookings...</div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="text-muted-foreground">No upcoming bookings.</div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <Card key={booking._id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={booking.artist?.profileImage} />
                            <AvatarFallback>{booking.artist?.name?.charAt(0) || "A"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">
                              {booking.service || `Live ${booking.category?.name || "Service"} Session with ${booking.artist?.name ?? "Artist"}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(booking)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={getStatusVariant(booking.status)}>
                              {booking.status || "Pending"}
                            </Badge>
                            <Link href={`/customer/bookings/${booking._id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {loading ? (
                  <div className="text-muted-foreground">Loading bookings...</div>
                ) : pastBookings.length === 0 ? (
                  <div className="text-muted-foreground">No past bookings.</div>
                ) : (
                  pastBookings.map((booking) => (
                    <Card key={booking._id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={booking.artist?.profileImage} />
                            <AvatarFallback>
                              {booking.artist?.name?.charAt(0) || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">
                              {booking.service || `Live ${booking.category?.name || "Service"} Session with ${typeof booking.artist === 'object' ? booking.artist.name : "Artist"}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(booking)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={getStatusVariant(booking.status)}>
                              {booking.status || "Completed"}
                            </Badge>
                            <Link href={`/customer/bookings/${booking._id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </CustomerLayout>
  );
}

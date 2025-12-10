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
      <header className="h-20 border-b border-white/5 bg-[#13111c] flex items-center justify-between px-8">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search for painters, musicians, photographers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-[#1e1b29] border-none text-white placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#5b21b6]"
              />
            </div>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-4">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full h-10 w-10">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10 border-2 border-[#5b21b6]">
            <AvatarFallback className="bg-[#fcd34d] text-black font-bold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-[#13111c]">
        <div className="space-y-10 max-w-7xl mx-auto">
          {/* Featured Artists Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white/90">Featured Artists</h2>
            {loading ? (
              <div className="text-gray-500">Loading artists...</div>
            ) : featuredArtists.length === 0 ? (
              <div className="text-gray-500">No featured artists available.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredArtists.map((artist) => (
                  <Card key={artist._id} className="bg-[#181524] border-none rounded-[32px] overflow-hidden hover:bg-[#201d2e] transition-all duration-300 group shadow-lg shadow-black/20">
                    <CardContent className="p-5">
                      <div className="relative w-full aspect-[1.1/1] overflow-hidden rounded-[24px] mb-5">
                        <Image
                          src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || "Artist")}&size=400&background=random`}
                          alt={artist.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-bold text-[19px] text-white leading-tight">{artist.name}</h3>
                          <p className="text-[15px] text-gray-500 font-medium mt-1">
                            {artist.category?.name || "Artist"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 py-1">
                          <Star className="h-[18px] w-[18px] fill-[#a78bfa] text-[#a78bfa]" />
                          <span className="text-[15px] font-medium text-gray-300">
                            {artist.rating?.toFixed(1) || "0.0"} <span className="text-gray-500 ml-1">({artist.reviewCount || 0} reviews)</span>
                          </span>
                        </div>
                        <Link href={`/artists/${artist._id}`} className="block mt-4">
                          <Button className="w-full bg-[#2a2636] hover:bg-[#353144] text-white font-semibold h-[52px] rounded-[20px] text-[15px] tracking-wide transition-colors">
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white/90">My Bookings</h2>
              <Tabs defaultValue="upcoming" className="w-auto">
                <TabsList className="bg-[#1e1b29] text-gray-400 border border-white/5">
                  <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#5b21b6] data-[state=active]:text-white">Upcoming</TabsTrigger>
                  <TabsTrigger value="past" className="data-[state=active]:bg-[#5b21b6] data-[state=active]:text-white">Past</TabsTrigger>
                </TabsList>
                
                <div className="hidden">
                  <TabsContent value="upcoming"></TabsContent>
                  <TabsContent value="past"></TabsContent>
                </div>
              </Tabs>
            </div>
            
            <Tabs defaultValue="upcoming" className="w-full">
               {/* Hidden list to control state, but we render content below manually based on state if we wanted, 
                   but here we need to restructure to match the design where tabs control the view. 
                   I will keep the structure simple and just use the TabsContent properly.
               */}
               <TabsList className="hidden">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
               </TabsList>

              <TabsContent value="upcoming" className="space-y-4 mt-0">
                {loading ? (
                  <div className="text-gray-500">Loading bookings...</div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="text-gray-500">No upcoming bookings.</div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <Card key={booking._id} className="bg-[#1e1b29] border-none hover:bg-[#252134] transition-colors">
                      <CardContent className="p-4 flex items-center gap-6">
                        <Avatar className="h-16 w-16 rounded-xl border-2 border-white/5">
                          <AvatarImage src={booking.artist?.profileImage} className="rounded-xl object-cover" />
                          <AvatarFallback className="rounded-xl bg-[#2e1065] text-white">
                            {booking.artist?.name?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-white mb-1 truncate">
                            {booking.service || `Live ${booking.category?.name || "Service"} Session`}
                          </h3>
                          <p className="text-sm text-gray-400">
                            with {booking.artist?.name ?? "Artist"}
                          </p>
                        </div>

                        <div className="text-right px-4 border-l border-white/5">
                          <p className="text-sm font-medium text-gray-300">
                            {formatDate(booking).split(',')[0]}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(booking).split(',')[1] || ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 pl-4">
                          <Badge variant={getStatusVariant(booking.status)} className="bg-[#059669]/20 text-[#34d399] hover:bg-[#059669]/30 border-none px-3 py-1">
                            {booking.status || "Pending"}
                          </Badge>
                          <Link href={`/customer/bookings/${booking._id}`}>
                            <Button className="bg-[#2e1065] hover:bg-[#4c1d95] text-[#e9d5ff] border border-[#5b21b6]/30">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4 mt-0">
                {loading ? (
                  <div className="text-gray-500">Loading bookings...</div>
                ) : pastBookings.length === 0 ? (
                  <div className="text-gray-500">No past bookings.</div>
                ) : (
                  pastBookings.map((booking) => (
                    <Card key={booking._id} className="bg-[#1e1b29] border-none hover:bg-[#252134] transition-colors">
                      <CardContent className="p-4 flex items-center gap-6">
                        <Avatar className="h-16 w-16 rounded-xl border-2 border-white/5">
                          <AvatarImage src={booking.artist?.profileImage} className="rounded-xl object-cover" />
                          <AvatarFallback className="rounded-xl bg-[#2e1065] text-white">
                            {booking.artist?.name?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-white mb-1 truncate">
                            {booking.service || `Live ${booking.category?.name || "Service"} Session`}
                          </h3>
                          <p className="text-sm text-gray-400">
                            with {typeof booking.artist === 'object' ? booking.artist.name : "Artist"}
                          </p>
                        </div>

                        <div className="text-right px-4 border-l border-white/5">
                          <p className="text-sm font-medium text-gray-300">
                            {formatDate(booking).split(',')[0]}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(booking).split(',')[1] || ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 pl-4">
                          <Badge variant={getStatusVariant(booking.status)} className="bg-gray-500/20 text-gray-400 border-none px-3 py-1">
                            {booking.status || "Completed"}
                          </Badge>
                          <Link href={`/customer/bookings/${booking._id}`}>
                            <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white">
                              View Details
                            </Button>
                          </Link>
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

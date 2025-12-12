"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent } from "@/components/ui/card";
import { bookingService } from "@/services/booking.service";
import { categoryService } from "@/services/category.service";
import { artistService } from "@/services/artist.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Colorful background palette for artist cards
const cardColors = [
  "bg-gradient-to-br from-emerald-400 to-teal-500",
  "bg-gradient-to-br from-cyan-400 to-emerald-400",
  "bg-gradient-to-br from-amber-300 to-yellow-400",
  "bg-gradient-to-br from-fuchsia-500 to-purple-600",
  "bg-gradient-to-br from-orange-300 to-rose-400",
  "bg-gradient-to-br from-lime-400 to-green-500",
  "bg-gradient-to-br from-pink-400 to-rose-500",
  "bg-gradient-to-br from-violet-400 to-indigo-500",
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [featuredArtists, setFeaturedArtists] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
        // Fetch categories
        const categoriesResponse = await categoryService.getAll();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

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
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#13111c]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search Bar */}
          <div className="mb-10">
            <form onSubmit={handleSearch}>
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search for painters, musicians, photographers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-[#1e1b29] border-none text-white placeholder:text-gray-500 h-14 rounded-xl focus-visible:ring-1 focus-visible:ring-[#5b21b6] text-base"
                />
              </div>
            </form>
          </div>

          <div className="space-y-12">
            {/* Browse Categories Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
                <p className="text-gray-400">Discover artists by their specialty</p>
              </div>
              {loading ? (
                <div className="text-gray-500">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="text-gray-500 bg-[#1e1b29] rounded-2xl p-8 text-center">
                  No categories available.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/browse?category=${category._id}`}
                      className="group"
                    >
                      <Card className="bg-[#181524] border-none rounded-2xl overflow-hidden hover:bg-[#201d2e] transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-purple-900/30 hover:-translate-y-1">
                        <CardContent className="p-4 text-center">
                          {category.image ? (
                            <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-square mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                              <span className="text-4xl">🎨</span>
                            </div>
                          )}
                          <h3 className="font-semibold text-sm text-white group-hover:text-[#a78bfa] transition-colors line-clamp-1">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {category.artistCount || 0} artists
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Featured Artists Section - More Prominent */}
            <section className="bg-gradient-to-br from-[#1e1b29] to-[#13111c] rounded-3xl p-8 border border-white/5">
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-3">Featured Artists</h2>
                <p className="text-gray-400 text-lg">Discover our top-rated talented artists</p>
              </div>
              {loading ? (
                <div className="text-gray-500 text-center py-8">Loading artists...</div>
              ) : featuredArtists.length === 0 ? (
                <div className="text-gray-500 bg-[#13111c] rounded-2xl p-8 text-center">
                  No featured artists available.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredArtists.map((artist, index) => (
                    <Card key={artist._id} className="bg-[#13111c] border border-white/5 rounded-3xl overflow-hidden hover:border-[#5b21b6]/50 transition-all duration-300 group shadow-xl shadow-black/30 hover:shadow-purple-900/40 hover:-translate-y-2">
                      <CardContent className="p-5">
                        {/* Colorful Avatar Container */}
                        <div className={`relative w-full aspect-square overflow-hidden rounded-2xl mb-4 ${cardColors[index % cardColors.length]} flex items-center justify-center`}>
                          {artist.profileImage ? (
                            <Image
                              src={artist.profileImage}
                              alt={artist.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <span className="text-6xl font-bold text-black/70">
                              {getInitials(artist.name)}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-lg text-white leading-tight line-clamp-1">{artist.name}</h3>
                            <p className="text-sm text-gray-400 font-medium mt-1">
                              {artist.category?.name || "Artist"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
                            <span className="text-sm font-semibold text-[#fbbf24]">
                              {artist.rating?.toFixed(1) || "0.0"}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({artist.reviewCount || 0})
                            </span>
                          </div>
                          <Link href={`/artists/${artist._id}`} className="block mt-3">
                            <Button className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white font-medium h-11 rounded-2xl text-sm transition-all shadow-lg shadow-purple-900/30">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* My Bookings Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">My Bookings</h2>
                <p className="text-gray-400">Manage your upcoming and past appointments</p>
              </div>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="bg-[#1e1b29] text-gray-400 border border-white/5 mb-8 h-12">
                <TabsTrigger 
                  value="upcoming" 
                  className="data-[state=active]:bg-[#5b21b6] data-[state=active]:text-white px-6 rounded-lg"
                >
                  Upcoming
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  className="data-[state=active]:bg-[#5b21b6] data-[state=active]:text-white px-6 rounded-lg"
                >
                  Past
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4 mt-0">
                {loading ? (
                  <div className="text-gray-500 bg-[#1e1b29] rounded-2xl p-8 text-center">Loading bookings...</div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="text-gray-400 bg-[#1e1b29] rounded-2xl p-12 text-center">
                    <p className="mb-4">No upcoming bookings.</p>
                    <Link href="/browse" className="text-[#a78bfa] hover:underline font-medium">
                      Browse artists to make a booking →
                    </Link>
                  </div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <Card key={booking._id} className="bg-[#1e1b29] border-white/5 hover:border-[#5b21b6]/30 transition-all rounded-2xl">
                      <CardContent className="p-5 flex items-center gap-6">
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
                            <Button className="bg-[#5b21b6] hover:bg-[#4c1d95] text-white border-none">
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
                  <div className="text-gray-500 bg-[#1e1b29] rounded-2xl p-8 text-center">Loading bookings...</div>
                ) : pastBookings.length === 0 ? (
                  <div className="text-gray-400 bg-[#1e1b29] rounded-2xl p-12 text-center">
                    No past bookings yet.
                  </div>
                ) : (
                  pastBookings.map((booking) => (
                    <Card key={booking._id} className="bg-[#1e1b29] border-white/5 hover:border-white/10 transition-all rounded-2xl">
                      <CardContent className="p-5 flex items-center gap-6">
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
          </section>
        </div>
      </div>
      </div>
    </CustomerLayout>
  );
}

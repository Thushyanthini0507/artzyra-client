"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { artistService } from "@/services/artist.service";
import { reviewService } from "@/services/review.service";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Loader2, Star, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, ExternalLink, Image as ImageIcon, Search } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { formatHourlyRate, formatLKR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { FavoriteButton } from "@/components/FavoriteButton";

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const artistId = params.id as string;

  const [artist, setArtist] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [portfolioFilter, setPortfolioFilter] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch artist data
        const artistResponse = await artistService.getById(artistId);
        if (artistResponse.success && artistResponse.data) {
          const artistData = artistResponse.data;
          setArtist(artistData);

          // Fetch related artists (same category, excluding current artist)
          if (artistData.category?._id) {
            try {
              const relatedResponse = await artistService.getAllArtists({
                category: artistData.category._id,
                limit: 6,
              });
              if (relatedResponse.success && relatedResponse.data) {
                // Filter out current artist and limit to 6
                const related = relatedResponse.data
                  .filter((a: any) => a._id !== artistId)
                  .slice(0, 6);
                setRelatedArtists(related);
              }
            } catch (error) {
              console.error("Failed to fetch related artists", error);
              // Don't show error, just continue without related artists
            }
          }
        } else {
          toast.error("Artist not found");
          router.push("/browse");
          return;
        }

        // Fetch reviews
        try {
          const reviewsResponse = await apiClient.get(`/reviews/artist/${artistId}`);
          if (reviewsResponse.data?.success && reviewsResponse.data?.data) {
            const reviewsData = reviewsResponse.data.data;
            setReviews(reviewsData);
            
            // Calculate review stats
            if (reviewsData.length > 0) {
              const total = reviewsData.length;
              const average = reviewsData.reduce(
                (acc: number, r: any) => acc + (r.rating || 0),
                0
              ) / total;
              setReviewStats({
                averageRating: Math.round(average * 10) / 10,
                totalReviews: total,
              });
            }
          }
        } catch (reviewError) {
          console.error("Failed to fetch reviews", reviewError);
          // Reviews are optional, so we don't show an error
        }

        // Fetch favorites if user is a customer
        if (user && user.role === "customer") {
          try {
            const { customerService } = await import("@/services/customer.service");
            const favoritesResponse = await customerService.getFavorites();
            if (favoritesResponse.success) {
              setFavorites(favoritesResponse.data.map((f: any) => f._id));
            }
          } catch (err) {
            console.error("Failed to fetch favorites", err);
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch artist", error);
        toast.error(error.message || "Failed to load artist profile");
        router.push("/browse");
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      fetchData();
    }
  }, [artistId, user, router]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  };

  // Filter portfolio images
  const filteredPortfolio = artist?.portfolio || [];
  const portfolioImages = portfolioFilter === "all" 
    ? filteredPortfolio 
    : filteredPortfolio; // You can add more sophisticated filtering later

  // Get location string
  const getLocation = () => {
    if (!artist?.location) return "Location not specified";
    const { city, state, country } = artist.location;
    const parts = [city, state, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  // Get profession/title
  const getProfession = () => {
    if (artist?.category?.name) {
      return artist.category.name;
    }
    if (artist?.skills && artist.skills.length > 0) {
      return artist.skills[0];
    }
    return "Artist";
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (!artist) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#13111c] text-white font-sans">
      {/* Top Navbar */}
      <PublicNavbar />

      {/* Banner Section */}
      <div className="relative w-full h-[400px] md:h-[500px] px-6 pt-24">
        <div className="relative w-full h-full rounded-[32px] overflow-hidden">
          {artist.profileImage ? (
            <img
              src={artist.profileImage}
              alt={artist.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=600&fit=crop&q=80`;
              }}
            />
          ) : (
            <img
              src={`https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop&q=80`}
              alt="Artist banner"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-10">
            <h1 className="text-5xl font-bold text-white mb-2">
              {artist.name} - {getProfession()}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Card */}
            <div className="bg-[#1e1b29] rounded-[32px] p-8 text-center border border-white/5 relative shadow-xl mt">
              <div className="relative inline-block mb-4 ">
                <Avatar className="h-32 w-32 border-4 border-[#1e1b29] shadow-lg">
                  <AvatarImage 
                    src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || 'Artist')}&size=200&background=random&color=fff&bold=true`} 
                    alt={artist.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-[#5b21b6] text-white">
                    {artist.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">{artist.name}</h2>
              <p className="text-[#a78bfa] font-medium mb-2">{getProfession()}</p>
              
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-4">
                <MapPin className="h-4 w-4" />
                <span>{getLocation()}</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Star className="h-5 w-5 fill-[#fbbf24] text-[#fbbf24]" />
                <span className="font-bold text-white">{reviewStats.averageRating || artist.rating || 0}</span>
                <span className="text-gray-500">({reviewStats.totalReviews || 0} reviews)</span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {artist.bio || "With a passion for vibrant colors, I specialize in creating large-scale murals and intimate portraits that capture the essence of my subjects."}
              </p>

              <div className="flex justify-center gap-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <div key={i} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#5b21b6] hover:text-white transition-colors cursor-pointer">
                    <Icon className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Request a Quote */}
            <div className="bg-[#1e1b29] rounded-[32px] p-8 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">Request a Quote</h3>
              <p className="text-gray-400 text-sm mb-6">
                Pricing starts at {formatHourlyRate(artist.hourlyRate || 500)}. Let {artist.name} know about your project. She'll get back to you with a personalized quote.
              </p>
              <Button 
                className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white h-12 rounded-xl font-semibold"
                onClick={() => {
                  if (user?.role === "customer") {
                    router.push(`/bookings/create?artistId=${artistId}`);
                  } else {
                    const redirectUrl = encodeURIComponent(`/bookings/create?artistId=${artistId}`);
                    router.push(`/auth/login?redirect=${redirectUrl}`);
                  }
                }}
              >
                Book Now
              </Button>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-8 space-y-10 lg:mt-[-100px]">
            {/* Services Section */}
            <div className=" mt-20">
              <h3 className="text-2xl font-bold text-white mb-6">Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(artist.skills && artist.skills.length > 0 ? artist.skills : ["Consultation", "Standard Service", "Premium Service", "Custom Project"]).map((skill: string, i: number) => (
                  <div key={i} className="bg-[#1e1b29] rounded-[24px] p-6 border border-white/5 hover:bg-[#252134] transition-colors group cursor-pointer">
                    <h4 className="text-lg font-bold text-white mb-2">{skill}</h4>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">Professional {skill.toLowerCase()} services tailored to your specific needs and requirements.</p>
                    <p className="text-[#a78bfa] font-semibold text-sm">Starts at {formatLKR(artist.hourlyRate || 500)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Portfolio</h3>
                <div className="flex gap-2">
                  {["All", "Murals", "Portraits"].map((filter) => (
                    <button 
                      key={filter}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                        filter === "All" 
                          ? "bg-[#5b21b6] text-white" 
                          : "bg-[#1e1b29] text-gray-400 hover:text-white"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  "1562322140-8baeececf3df",
                  "1560066984-138dadb4c035",
                  "1595476108010-b4d1f102b1b1",
                  "1522337660859-02fbefca4702",
                  "1521590832917-230085070200",
                  "1516975080664-ed2fc6a32937"
                ].map((id, i) => (
                  <div key={i} className="aspect-square rounded-[24px] overflow-hidden relative group cursor-pointer">
                    <img
                      src={`https://images.unsplash.com/photo-${id}?w=500&h=500&fit=crop&q=80`}
                      alt={`Portfolio ${i}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  </div>
                ))}
              </div>

            </div>

            {/* Ratings & Reviews */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Ratings & Reviews</h3>
              <div className="space-y-4">
                {[
                  { name: "Jane Doe", rating: 5, comment: "Elena painted a stunning mural for our office. She was professional, creative, and brought our vision to life perfectly. Highly recommend!" },
                  { name: "John Smith", rating: 5, comment: "The portrait of my family exceeded all expectations. Elena has an incredible talent for capturing personality on canvas." }
                ].map((review, i) => (
                  <div key={i} className="bg-[#1e1b29] rounded-[24px] p-6 border border-white/5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${review.name}&background=random`} />
                          <AvatarFallback>{review.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-white text-sm">{review.name}</h4>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-[#fbbf24] text-[#fbbf24]" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar (Optional/Decorative based on image) */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1e1b29]/90 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-50">
         <div className="p-2 bg-[#5b21b6] rounded-lg text-white cursor-pointer">
            <ExternalLink className="h-5 w-5" />
         </div>
         <div className="text-gray-400 hover:text-white cursor-pointer"><span className="text-xl">✋</span></div>
         <div className="text-gray-400 hover:text-white cursor-pointer"><Search className="h-5 w-5" /></div>
         <div className="text-gray-400 hover:text-white cursor-pointer"><ImageIcon className="h-5 w-5" /></div>
      </div>
    </div>
  );
}


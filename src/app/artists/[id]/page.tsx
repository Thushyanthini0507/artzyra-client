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
import { Loader2, Star, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, ExternalLink, Image as ImageIcon } from "lucide-react";
import { formatHourlyRate } from "@/lib/utils/currency";
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
    <PublicLayout>
      <div className="min-h-screen bg-background">
        {/* Banner Section */}
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
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
              src={`https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=600&fit=crop&q=80`}
              alt="Artist banner"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {artist.name} - {getProfession()}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Artist Profile Card */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage 
                        src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || 'Artist')}&size=200&background=random&color=fff&bold=true`} 
                        alt={artist.name}
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || 'Artist')}&size=200&background=random&color=fff&bold=true`;
                        }}
                      />
                      <AvatarFallback className="text-2xl">
                        {artist.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{artist.name}</h2>
                      <p className="text-muted-foreground">{getProfession()}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{getLocation()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(reviewStats.averageRating || artist.rating || 0)}
                      <span className="text-sm font-medium">
                        {reviewStats.averageRating || artist.rating || 0} ({reviewStats.totalReviews || 0} reviews)
                      </span>
                    </div>
                    {user?.role === "customer" && (
                      <FavoriteButton
                        artistId={artist._id}
                        initialIsFavorite={favorites.includes(artist._id)}
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    {artist.bio || "No bio available."}
                  </p>
                  {(artist.socialLinks?.facebook || 
                    artist.socialLinks?.instagram || 
                    artist.socialLinks?.twitter || 
                    artist.socialLinks?.linkedin || 
                    artist.socialLinks?.youtube) && (
                    <div className="flex justify-center gap-4 mt-4">
                      {artist.socialLinks.facebook && (
                        <a
                          href={artist.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {artist.socialLinks.instagram && (
                        <a
                          href={artist.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {artist.socialLinks.twitter && (
                        <a
                          href={artist.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {artist.socialLinks.linkedin && (
                        <a
                          href={artist.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {artist.socialLinks.youtube && (
                        <a
                          href={artist.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Youtube className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Request a Quote Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Request a Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Pricing starts at {formatHourlyRate(artist.hourlyRate || 0)}. Let {artist.name} know about your project. They'll get back to you with a personalized quote.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      if (user?.role === "customer") {
                        router.push(`/bookings/create?artistId=${artistId}`);
                      } else {
                        router.push("/auth/login");
                      }
                    }}
                  >
                    Request a Quote
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Services Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Creative Professional Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        We provide high-quality and reliable professional services tailored to your needs. Starting at {formatHourlyRate(artist.hourlyRate || 558)}.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Portfolio Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Portfolio</CardTitle>
                    {portfolioImages.length > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant={portfolioFilter === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPortfolioFilter("all")}
                        >
                          All
                        </Button>
                        {/* You can add more filters here based on your portfolio structure */}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {portfolioImages.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }, (_, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={`https://images.unsplash.com/photo-${1541961017774 + index}?w=400&h=400&fit=crop&q=80`}
                            alt={`Portfolio placeholder ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to a different placeholder service
                              e.currentTarget.src = `https://picsum.photos/400/400?random=${index}`;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {portfolioImages.slice(0, 6).map((image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder image
                              e.currentTarget.src = `https://images.unsplash.com/photo-${1541961017774 + index}?w=400&h=400&fit=crop&q=80`;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ratings & Reviews Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Ratings & Reviews</CardTitle>
                    {reviewStats.totalReviews > 0 && (
                      <Link
                        href={`/artists/${artistId}/reviews`}
                        className="text-sm text-primary hover:underline"
                      >
                        {reviewStats.totalReviews} reviews
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No reviews yet. Be the first to review!
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.slice(0, 5).map((review: any) => (
                        <div key={review._id} className="flex gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.customer?.profileImage}
                              alt={review.customer?.name}
                            />
                            <AvatarFallback>
                              {review.customer?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {review.customer?.name || "Anonymous"}
                              </span>
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.comment || "No comment provided."}
                            </p>
                          </div>
                        </div>
                      ))}
                      {reviews.length > 5 && (
                        <div className="text-center pt-4">
                          <Link
                            href={`/artists/${artistId}/reviews`}
                            className="text-sm text-primary hover:underline"
                          >
                            View all {reviewStats.totalReviews} reviews
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Photos Section - Full Width */}
          {relatedArtists.length > 0 && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Related Artists</CardTitle>
                  <CardDescription>
                    Discover other talented artists in the same category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {relatedArtists.map((relatedArtist: any) => (
                      <Link
                        key={relatedArtist._id}
                        href={`/artists/${relatedArtist._id}`}
                        className="group"
                      >
                        <div className="space-y-2">
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group-hover:opacity-90 transition-opacity">
                            <img
                              src={
                                relatedArtist.profileImage ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(relatedArtist.name || 'Artist')}&size=200&background=random&color=fff&bold=true`
                              }
                              alt={relatedArtist.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(relatedArtist.name || 'Artist')}&size=200&background=random&color=fff&bold=true`;
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium truncate">
                              {relatedArtist.name}
                            </p>
                            {relatedArtist.category?.name && (
                              <p className="text-xs text-muted-foreground truncate">
                                {relatedArtist.category.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}


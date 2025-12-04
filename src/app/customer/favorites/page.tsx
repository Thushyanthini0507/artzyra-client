"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Loader2 } from "lucide-react";
import { customerService } from "@/lib/api/services/customerService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import Link from "next/link";
import { formatHourlyRate } from "@/lib/utils/currency";

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await customerService.getFavorites();
        if (response.success) {
          setFavorites(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleToggle = (artistId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      setFavorites((prev) => prev.filter((artist) => artist._id !== artistId));
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground">Artists you've saved</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Artists</CardTitle>
            <CardDescription>Your saved artists for quick booking</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Heart className="h-16 w-16 mb-4" />
                <p className="text-lg">No favorites yet</p>
                <p className="text-sm">Browse artists and save your favorites</p>
                <Link href="/browse" className="mt-4">
                  <Button>Browse Artists</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((artist) => (
                  <Card key={artist._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 border-2 border-background">
                          <AvatarImage src={artist.profileImage} alt={artist.name} />
                          <AvatarFallback>{artist.name?.charAt(0) || "A"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <CardTitle className="truncate">{artist.name}</CardTitle>
                            <FavoriteButton 
                              artistId={artist._id} 
                              initialIsFavorite={true}
                              onToggle={(isFavorite) => handleToggle(artist._id, isFavorite)}
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              Artist
                            </span>
                            {artist.rating && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{artist.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 mb-4 min-h-[3rem]">
                        {artist.bio || "No bio available for this artist."}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {formatHourlyRate(artist.hourlyRate)}
                        </span>
                        <Button size="sm" variant="secondary">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}

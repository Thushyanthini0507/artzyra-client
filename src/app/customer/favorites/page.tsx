"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Loader2 } from "lucide-react";
import { customerService } from "@/services/customer.service";
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
      <main className="flex-1 p-8 overflow-y-auto h-full">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
            <p className="text-gray-400">Artists you've saved</p>
          </div>

          <Card className="bg-[#1e1b29] border-white/5 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Favorite Artists</CardTitle>
              <CardDescription className="text-gray-400">Your saved artists for quick booking</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#5b21b6]" />
                </div>
              ) : favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Heart className="h-16 w-16 mb-4 text-[#5b21b6]" />
                  <p className="text-lg text-white">No favorites yet</p>
                  <p className="text-sm mb-4">Browse artists and save your favorites</p>
                  <Link href="/browse">
                    <Button className="bg-[#5b21b6] hover:bg-[#4c1d95] text-white rounded-xl">Browse Artists</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((artist) => (
                    <div key={artist._id} className="bg-[#181524] rounded-[32px] p-5 border border-white/5 flex flex-col gap-4 group hover:border-[#5b21b6]/30 transition-all duration-300">
                      <div className="relative h-48 rounded-[24px] overflow-hidden">
                         <img 
                           src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || 'Artist')}&background=random`} 
                           alt={artist.name}
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                         />
                         <div className="absolute top-3 right-3">
                            <FavoriteButton 
                              artistId={artist._id} 
                              initialIsFavorite={true}
                              onToggle={(isFavorite) => handleToggle(artist._id, isFavorite)}
                            />
                         </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-[19px] font-bold text-white truncate">{artist.name}</h3>
                          {artist.rating && (
                            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                              <Star className="h-3 w-3 fill-[#fbbf24] text-[#fbbf24]" />
                              <span className="text-xs font-bold text-white">{artist.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[15px] font-medium text-gray-400 mb-3 line-clamp-2 min-h-[45px]">
                          {artist.bio || "Professional Artist"}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[#a78bfa] font-semibold text-sm">
                            {formatHourlyRate(artist.hourlyRate)}
                          </span>
                          <Link href={`/artists/${artist._id}`}>
                             <Button className="h-[42px] bg-[#2a2636] hover:bg-[#5b21b6] text-white font-semibold text-[14px] rounded-[20px] px-6 transition-colors">
                               View Profile
                             </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </CustomerLayout>
  );
}

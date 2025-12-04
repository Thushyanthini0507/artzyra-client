"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useArtistPublicList } from "@/hooks/useApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryService } from "@/lib/api/services/categoryService";
import { FavoriteButton } from "@/components/FavoriteButton";
import { customerService } from "@/lib/api/services/customerService";
import { useAuth } from "@/contexts/auth-context";

export function BrowseArtists() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get("category");
  
  const { artists, loading, error } = useArtistPublicList(categoryId ? { category: categoryId } : {});
  const [categoryName, setCategoryName] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && user.role === "customer") {
        try {
          const response = await customerService.getFavorites();
          if (response.success) {
            setFavorites(response.data.map((f: any) => f._id));
          }
        } catch (err) {
          console.error("Failed to fetch favorites", err);
        }
      }
    };
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (categoryId) {
        try {
          const response = await categoryService.getAllCategories();
          const category = response.data.find((c: any) => c._id === categoryId);
          if (category) {
            setCategoryName(category.name);
          }
        } catch (err) {
          console.error("Failed to fetch category name", err);
        }
      } else {
        setCategoryName("");
      }
    };
    fetchCategoryName();
  }, [categoryId]);

  const handleClearFilter = () => {
    router.push("/browse");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading artists: {error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {categoryId && categoryName ? `${categoryName} Artists` : "Browse All Artists"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {artists.length} {artists.length === 1 ? "artist" : "artists"} found
          </p>
        </div>
        
        {categoryId && (
          <Button variant="outline" onClick={handleClearFilter}>
            Clear Filter
          </Button>
        )}
      </div>

      {artists.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No artists found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any artists matching your criteria.
          </p>
          {categoryId && (
            <Button onClick={handleClearFilter}>
              View All Artists
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
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
                        initialIsFavorite={favorites.includes(artist._id)} 
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {artist.category?.name || "Artist"}
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
                    ${artist.hourlyRate || 0}/hr
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
    </div>
  );
}

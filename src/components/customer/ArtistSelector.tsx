"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtistsByCategory } from "@/hooks/useBookingFlow";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ArtistSelectorProps {
  categoryId: string;
  onSelect: (artistId: string) => void;
  onBack: () => void;
}

export function ArtistSelector({ categoryId, onSelect, onBack }: ArtistSelectorProps) {
  const { artists, loading, error } = useArtistsByCategory(categoryId);

  if (loading) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Categories
        </Button>
        <h2 className="text-2xl font-bold">Select an Artist</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex-row gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Categories
        </Button>
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Categories
        </Button>
        <div className="text-center py-10">
          <p className="text-muted-foreground">No artists available in this category</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack}>
        ← Back to Categories
      </Button>
      <div>
        <h2 className="text-2xl font-bold">Select an Artist</h2>
        <p className="text-muted-foreground">Choose the artist you'd like to book</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {artists.map((artist) => (
          <Card
            key={artist._id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelect(artist._id)}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={artist.profileImage} alt={artist.name} />
                  <AvatarFallback>{artist.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle>{artist.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{artist.bio || "Professional artist"}</CardDescription>
                  {artist.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{artist.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Select Artist
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtistsByCategory } from "@/hooks/useBookingFlow";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import Image from "next/image";

interface ArtistSelectorProps {
  categoryId: string;
  onSelect: (artistId: string) => void;
  onBack: () => void;
}

export function ArtistSelector({ categoryId, onSelect, onBack }: ArtistSelectorProps) {
  const { artists, loading, error } = useArtistsByCategory(categoryId);

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={onBack}>
          ← Back to Categories
        </Button>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Select an Artist</h2>
          <p className="text-muted-foreground">Choose the artist you'd like to book</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-full flex-shrink-0 -mt-8 border-4 border-background" />
                  <div className="flex-1 space-y-2 pt-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={onBack}>
          ← Back to Categories
        </Button>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Select an Artist</h2>
          <p className="text-muted-foreground">Choose the artist you'd like to book</p>
        </div>
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={onBack}>
          ← Back to Categories
        </Button>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Select an Artist</h2>
          <p className="text-muted-foreground">Choose the artist you'd like to book</p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No artists available in this category</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        ← Back to Categories
      </Button>
      
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Select an Artist</h2>
        <p className="text-muted-foreground">Choose the artist you'd like to book</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <Card
            key={artist._id}
            className="cursor-pointer hover:border-primary transition-colors overflow-hidden"
            onClick={() => onSelect(artist._id)}
          >
            {/* Profile Image */}
            <div className="relative w-full h-48 overflow-hidden bg-muted">
              <Image
                src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || "Artist")}&size=400&background=random&color=fff&bold=true`}
                alt={artist.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || "Artist")}&size=400&background=random&color=fff&bold=true`;
                }}
              />
            </div>
            
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 flex-shrink-0 -mt-8 border-4 border-background">
                  <AvatarImage src={artist.profileImage} alt={artist.name} />
                  <AvatarFallback className="bg-muted text-foreground text-lg font-medium">
                    {artist.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 pt-2">
                  <CardTitle className="text-base font-semibold mb-1">{artist.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                    {artist.bio || "Professional artist"}
                  </CardDescription>
                  {artist.rating && (
                    <div className="flex items-center gap-1 mt-1">
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

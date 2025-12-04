"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { customerService } from "@/lib/api/services/customerService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

interface FavoriteButtonProps {
  artistId: string;
  initialIsFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}

export function FavoriteButton({ artistId, initialIsFavorite = false, onToggle, className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }

    if (user.role !== "customer") {
      toast.error("Only customers can save favorites");
      return;
    }

    const previousState = isFavorite;
    setIsFavorite(!isFavorite); // Optimistic update
    setLoading(true);

    try {
      const response = await customerService.toggleFavorite(artistId);
      if (response.success) {
        if (onToggle) onToggle(response.isFavorited);
        toast.success(response.isFavorited ? "Added to favorites" : "Removed from favorites");
      } else {
        setIsFavorite(previousState); // Revert on failure
        toast.error("Failed to update favorite");
      }
    } catch (error) {
      setIsFavorite(previousState); // Revert on error
      toast.error("Failed to update favorite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-background/80 ${className}`}
      onClick={handleToggle}
      disabled={loading}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
        }`}
      />
    </Button>
  );
}

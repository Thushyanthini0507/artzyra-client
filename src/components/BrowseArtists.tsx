"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useArtistPublicList, useCategories } from "@/hooks/useApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, Loader2, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { customerService } from "@/services/customer.service";
import { useAuth } from "@/contexts/auth-context";
import { formatHourlyRate } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function BrowseArtists() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  // Get filter values from URL params
  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "rating";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const minRating = searchParams.get("minRating") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const location = searchParams.get("location") || "";

  // Local state for filters
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [selectedRating, setSelectedRating] = useState(minRating);
  const [priceRange, setPriceRange] = useState(maxPrice);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    location: false,
    price: false,
    rating: false,
  });

  // Fetch data
  const { artists, pagination, loading, error } = useArtistPublicList({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    page,
    limit: 12,
  });
  
  const { categories } = useCategories();
  const [favorites, setFavorites] = useState<string[]>([]);

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

  // Update URL params when filters change
  const updateFilters = () => {
    const params = new URLSearchParams();
    if (localSearch) params.set("search", localSearch);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedRating) params.set("minRating", selectedRating);
    if (priceRange) params.set("maxPrice", priceRange);
    if (selectedLocation) params.set("location", selectedLocation);
    if (sortBy !== "rating") params.set("sort", sortBy);
    if (page > 1) params.set("page", page.toString());
    
    router.push(`/browse?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    params.delete("page"); // Reset to page 1
    router.push(`/browse?${params.toString()}`);
  };

  const handleRatingChange = (value: string) => {
    setSelectedRating(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("minRating", value);
    } else {
      params.delete("minRating");
    }
    params.delete("page");
    router.push(`/browse?${params.toString()}`);
  };

  const handleApplyFilters = () => {
    updateFilters();
  };

  const handleResetFilters = () => {
    setLocalSearch("");
    setSelectedCategory("");
    setSelectedRating("");
    setPriceRange("");
    setSelectedLocation("");
    router.push("/browse");
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`/browse?${params.toString()}`);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Filter artists client-side for rating and price (until API supports it)
  let filteredArtists = artists;
  if (selectedRating) {
    const minRatingNum = parseFloat(selectedRating);
    filteredArtists = filteredArtists.filter(
      (artist: any) => (artist.rating || 0) >= minRatingNum
    );
  }
  if (priceRange) {
    const maxPriceNum = parseFloat(priceRange);
    filteredArtists = filteredArtists.filter(
      (artist: any) => (artist.hourlyRate || 0) <= maxPriceNum
    );
  }

  // Sort artists
  const sortedArtists = [...filteredArtists].sort((a: any, b: any) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "price-low":
        return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      case "price-high":
        return (b.hourlyRate || 0) - (a.hourlyRate || 0);
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      default:
        return 0;
    }
  });

  // Use API pagination if available, otherwise calculate from filtered results
  const totalItems = pagination?.totalItems || sortedArtists.length;
  const currentPage = pagination?.currentPage || page;
  const totalPagesCalc = pagination?.totalPages || Math.ceil(totalItems / 12);
  const paginatedArtists = pagination ? sortedArtists : sortedArtists;

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
    <div className="container mx-auto py-6 px-4">
      <div className="flex gap-6">
        {/* Left Sidebar - Filters */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Filter Artists</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Artist Category */}
              <div>
                <button
                  onClick={() => toggleSection("category")}
                  className="flex items-center justify-between w-full mb-3 font-medium"
                >
                  <span>Artist Category</span>
                  {expandedSections.category ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.category && (
                  <RadioGroup
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="" id="category-all" />
                        <Label htmlFor="category-all" className="cursor-pointer">
                          All Categories
                        </Label>
                      </div>
                      {categories.map((category: any) => (
                        <div key={category._id} className="flex items-center space-x-2">
                          <RadioGroupItem value={category._id} id={`category-${category._id}`} />
                          <Label htmlFor={`category-${category._id}`} className="cursor-pointer">
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </div>

              {/* Location */}
              <div>
                <button
                  onClick={() => toggleSection("location")}
                  className="flex items-center justify-between w-full mb-3 font-medium"
                >
                  <span>Location</span>
                  {expandedSections.location ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.location && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter location"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div>
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between w-full mb-3 font-medium"
                >
                  <span>Price Range</span>
                  {expandedSections.price ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.price && (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Max hourly rate"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Rating */}
              <div>
                <button
                  onClick={() => toggleSection("rating")}
                  className="flex items-center justify-between w-full mb-3 font-medium"
                >
                  <span>Rating</span>
                  {expandedSections.rating ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.rating && (
                  <RadioGroup
                    value={selectedRating}
                    onValueChange={handleRatingChange}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="" id="rating-all" />
                        <Label htmlFor="rating-all" className="cursor-pointer">
                          All Ratings
                        </Label>
                      </div>
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                          <Label htmlFor={`rating-${rating}`} className="cursor-pointer flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{rating}+</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </div>

              {/* Filter Buttons */}
              <div className="space-y-2 pt-4 border-t">
                <Button onClick={handleApplyFilters} className="w-full">
                  Apply Filters
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleResetFilters}
                  className="w-full"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Find Your Artist</h1>
            <p className="text-muted-foreground">
              Showing {totalItems} {totalItems === 1 ? "artist" : "artists"}
            </p>
          </div>

          {/* Search and Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search artists..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10"
              />
            </form>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Sort by: Rating</SelectItem>
                <SelectItem value="price-low">Sort by: Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Sort by: Price (High to Low)</SelectItem>
                <SelectItem value="name">Sort by: Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Artist Grid */}
          {paginatedArtists.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No artists found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any artists matching your criteria.
              </p>
              <Button onClick={handleResetFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedArtists.map((artist: any) => (
                  <Card 
                    key={artist._id} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Artist Image */}
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || 'Artist')}&size=400&background=random&color=fff&bold=true`}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || 'Artist')}&size=400&background=random&color=fff&bold=true`;
                        }}
                      />
                      {user?.role === "customer" && (
                        <div className="absolute top-2 right-2">
                          <FavoriteButton
                            artistId={artist._id}
                            initialIsFavorite={favorites.includes(artist._id)}
                          />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 space-y-4">
                      {/* Name and Category */}
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-xl font-bold">
                          {artist.name}
                        </CardTitle>
                        {artist.category?.name && (
                          <Badge variant="secondary">
                            {artist.category.name}
                          </Badge>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = artist.rating || 0;
                            const isHalf = star - 0.5 <= rating && rating < star;
                            const isFull = star <= rating;
                            
                            return (
                              <Star
                                key={star}
                                className={cn(
                                  "h-4 w-4",
                                  isFull
                                    ? "fill-yellow-400 text-yellow-400"
                                    : isHalf
                                    ? "fill-yellow-400/50 text-yellow-400"
                                    : "text-muted-foreground"
                                )}
                              />
                            );
                          })}
                        </div>
                        <span className="text-sm font-medium">
                          ({artist.rating ? artist.rating.toFixed(1) : "0.0"})
                        </span>
                      </div>

                      {/* Hourly Rate */}
                      <div className="text-sm font-medium text-primary">
                        {formatHourlyRate(artist.hourlyRate)}
                      </div>

                      {/* Description */}
                      <CardDescription className="text-sm line-clamp-3 min-h-[3.5rem]">
                        {artist.bio || "No bio available for this artist."}
                      </CardDescription>

                      {/* View Profile Button */}
                      <Button 
                        className="w-full"
                        asChild
                      >
                        <Link href={`/artists/${artist._id}`}>View Profile</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPagesCalc > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      if (currentPage > 1) {
                        params.set("page", (currentPage - 1).toString());
                      }
                      router.push(`/browse?${params.toString()}`);
                    }}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(totalPagesCalc, 8) }, (_, i) => {
                    let pageNum;
                    if (totalPagesCalc <= 8) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPagesCalc - 3) {
                      pageNum = totalPagesCalc - 7 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    
                    const showEllipsis = totalPagesCalc > 8;
                    const showStartEllipsis = showEllipsis && currentPage > 4 && i === 0;
                    const showEndEllipsis = showEllipsis && currentPage < totalPagesCalc - 3 && i === Math.min(totalPagesCalc, 8) - 1;
                    
                    if (showStartEllipsis) {
                      return (
                        <React.Fragment key={`start-${i}`}>
                          <Button
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const params = new URLSearchParams(searchParams.toString());
                              params.set("page", "1");
                              router.push(`/browse?${params.toString()}`);
                            }}
                          >
                            1
                          </Button>
                          <span className="px-2">...</span>
                        </React.Fragment>
                      );
                    }
                    
                    if (showEndEllipsis && pageNum !== totalPagesCalc) {
                      return (
                        <React.Fragment key={`end-${i}`}>
                          <Button
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const params = new URLSearchParams(searchParams.toString());
                              params.set("page", pageNum.toString());
                              router.push(`/browse?${params.toString()}`);
                            }}
                          >
                            {pageNum}
                          </Button>
                          <span className="px-2">...</span>
                          <Button
                            variant={currentPage === totalPagesCalc ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const params = new URLSearchParams(searchParams.toString());
                              params.set("page", totalPagesCalc.toString());
                              router.push(`/browse?${params.toString()}`);
                            }}
                          >
                            {totalPagesCalc}
                          </Button>
                        </React.Fragment>
                      );
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          params.set("page", pageNum.toString());
                          router.push(`/browse?${params.toString()}`);
                        }}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("page", (currentPage + 1).toString());
                      router.push(`/browse?${params.toString()}`);
                    }}
                    disabled={currentPage >= totalPagesCalc}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

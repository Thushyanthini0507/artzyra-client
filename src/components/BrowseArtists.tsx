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

const SRI_LANKA_DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya"
];

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
    setSelectedLocation("");
    router.push("/browse");
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("location", value);
    } else {
      params.delete("location");
      setSelectedLocation("");
    }
    params.delete("page");
    router.push(`/browse?${params.toString()}`);
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
      <div className="flex justify-center items-center min-h-[50vh] bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-white min-h-screen">
        <p className="text-red-500">Error loading artists: {error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto py-8 px-4">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-72 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl p-6 sticky top-24 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filter Artists</h2>
              </div>
              
              <div className="space-y-6">
                {/* Artist Category */}
                <div className="border-b border-gray-200 pb-6">
                  <button
                    onClick={() => toggleSection("category")}
                    className="flex items-center justify-between w-full mb-4 font-medium text-gray-900 hover:text-[#9b87f5] transition-colors"
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
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="" id="category-all" className="border-gray-300 text-[#9b87f5]" />
                        <Label htmlFor="category-all" className="cursor-pointer text-gray-600 hover:text-gray-900">
                          All Categories
                        </Label>
                      </div>
                      {categories.map((category: any) => (
                        <div key={category._id} className="flex items-center space-x-3">
                          <RadioGroupItem value={category._id} id={`category-${category._id}`} className="border-gray-300 text-[#9b87f5]" />
                          <Label htmlFor={`category-${category._id}`} className="cursor-pointer text-gray-600 hover:text-gray-900">
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>

                {/* Location */}
                <div className="border-b border-gray-200 pb-6">
                  <button
                    onClick={() => toggleSection("location")}
                    className="flex items-center justify-between w-full mb-4 font-medium text-gray-900 hover:text-[#9b87f5] transition-colors"
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
                      <Select 
                        value={selectedLocation || "all"} 
                        onValueChange={handleLocationChange}
                      >
                        <SelectTrigger className="w-full bg-white border-gray-200 text-gray-900 focus:ring-[#9b87f5]">
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900 max-h-[300px]">
                          <SelectItem value="all" className="focus:bg-gray-100 focus:text-gray-900">All Locations</SelectItem>
                          {SRI_LANKA_DISTRICTS.map((district) => (
                            <SelectItem key={district} value={district} className="focus:bg-gray-100 focus:text-gray-900">
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="border-b border-gray-200 pb-6">
                  <button
                    onClick={() => toggleSection("price")}
                    className="flex items-center justify-between w-full mb-4 font-medium text-gray-900 hover:text-[#9b87f5] transition-colors"
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
                        className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-[#9b87f5]"
                      />
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="pb-6">
                  <button
                    onClick={() => toggleSection("rating")}
                    className="flex items-center justify-between w-full mb-4 font-medium text-gray-900 hover:text-[#9b87f5] transition-colors"
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
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="" id="rating-all" className="border-gray-300 text-[#9b87f5]" />
                        <Label htmlFor="rating-all" className="cursor-pointer text-gray-600 hover:text-gray-900">
                          All Ratings
                        </Label>
                      </div>
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                          <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} className="border-gray-300 text-[#9b87f5]" />
                          <Label htmlFor={`rating-${rating}`} className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "h-3 w-3", 
                                    i < Math.floor(rating) ? "fill-[#9b87f5] text-[#9b87f5]" : "text-gray-600"
                                  )} 
                                />
                              ))}
                            </div>
                            <span>{rating}+</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>

                {/* Filter Buttons */}
                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={handleApplyFilters} 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 rounded-lg"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleResetFilters}
                    className="w-full text-muted-foreground hover:text-foreground hover:bg-accent h-11 rounded-lg"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Artist</h1>
                <p className="text-gray-600">
                  Showing {totalItems} {totalItems === 1 ? "artist" : "artists"}
                </p>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                 <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-gray-200 text-gray-900 focus:ring-[#9b87f5]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    <SelectItem value="rating" className="focus:bg-gray-100 focus:text-gray-900">Sort by: Rating</SelectItem>
                    <SelectItem value="price-low" className="focus:bg-gray-100 focus:text-gray-900">Price: Low to High</SelectItem>
                    <SelectItem value="price-high" className="focus:bg-gray-100 focus:text-gray-900">Price: High to Low</SelectItem>
                    <SelectItem value="name" className="focus:bg-gray-100 focus:text-gray-900">Sort by: Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8 relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search artists..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-12 h-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-[#9b87f5] rounded-xl w-full md:max-w-md"
                />
              </form>
            </div>

            {/* Artist Grid */}
            {paginatedArtists.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No artists found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any artists matching your criteria.
                </p>
                <Button onClick={handleResetFilters} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {paginatedArtists.map((artist: any) => (
                    <Card 
                      key={artist._id} 
                      className="bg-white border-gray-200 overflow-hidden hover:shadow-2xl hover:shadow-[#9b87f5]/10 transition-all duration-300 group shadow-sm"
                    >
                      {/* Artist Image */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <img
                          src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || 'Artist')}&size=400&background=random&color=fff&bold=true`}
                          alt={artist.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || 'Artist')}&size=400&background=random&color=fff&bold=true`;
                          }}
                        />
                        {user?.role === "customer" && (
                          <div className="absolute top-3 right-3">
                            <FavoriteButton
                              artistId={artist._id}
                              initialIsFavorite={favorites.includes(artist._id)}
                            />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent opacity-60"></div>
                      </div>

                      <CardContent className="p-5 space-y-4 relative">
                        {/* Name and Category */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                              {artist.name}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-3.5 w-3.5",
                                      i < Math.floor(artist.rating || 0)
                                        ? "fill-[#9b87f5] text-[#9b87f5]"
                                        : "text-gray-300"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                ({artist.rating ? artist.rating.toFixed(1) : "0.0"})
                              </span>
                            </div>
                          </div>
                          {artist.category?.name && (
                            <Badge className="bg-gray-100 hover:bg-gray-200 text-[#9b87f5] border-gray-200 px-3 py-1">
                              {artist.category.name}
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        <CardDescription className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                          {artist.bio || "No bio available for this artist."}
                        </CardDescription>

                        {/* View Profile Button */}
                        <Button 
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10 rounded-lg mt-2 transition-colors"
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
                  <div className="flex items-center justify-center gap-2 pb-8">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white border-gray-200 text-gray-900 hover:bg-gray-100 h-10 w-10"
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
                              className={cn(
                                "h-10 w-10",
                                currentPage === 1 
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 border-none" 
                                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-100"
                              )}
                              onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("page", "1");
                                router.push(`/browse?${params.toString()}`);
                              }}
                            >
                              1
                            </Button>
                            <span className="px-2 text-gray-500">...</span>
                          </React.Fragment>
                        );
                      }
                      
                      if (showEndEllipsis && pageNum !== totalPagesCalc) {
                        return (
                          <React.Fragment key={`end-${i}`}>
                            <Button
                              variant={currentPage === pageNum ? "default" : "outline"}
                              className={cn(
                                "h-10 w-10",
                                currentPage === pageNum 
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 border-none" 
                                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-100"
                              )}
                              onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("page", pageNum.toString());
                                router.push(`/browse?${params.toString()}`);
                              }}
                            >
                              {pageNum}
                            </Button>
                            <span className="px-2 text-gray-500">...</span>
                            <Button
                              variant={currentPage === totalPagesCalc ? "default" : "outline"}
                              className={cn(
                                "h-10 w-10",
                                currentPage === totalPagesCalc 
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 border-none" 
                                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-100"
                              )}
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
                              className={cn(
                                "h-10 w-10",
                                currentPage === pageNum 
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 border-none" 
                                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-100"
                              )}
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
                      size="icon"
                      className="bg-white border-gray-200 text-gray-900 hover:bg-gray-100 h-10 w-10"
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
    </div>
  );
}

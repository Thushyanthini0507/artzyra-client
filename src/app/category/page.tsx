"use client";

import { useState, useMemo } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useApi";
import { getCategoryImage } from "@/lib/categoryImages";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export default function CategoryPage() {
  const { categories, loading, error } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.filter(
      (category) =>
        category.name?.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="h-10 w-64 bg-muted rounded animate-pulse mx-auto" />
              <div className="h-6 w-96 bg-muted rounded animate-pulse mx-auto" />
            </div>
            <div className="h-12 w-full max-w-3xl bg-muted rounded animate-pulse mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-full">
                  <div className="w-full h-48 bg-muted animate-pulse" />
                  <CardHeader>
                    <div className="h-6 bg-muted rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Explore Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover talented artists across various creative fields. Browse by category to find the perfect match for your project.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-lg text-muted-foreground">
              {searchQuery
                ? `No categories found matching "${searchQuery}"`
                : "No categories available at the moment."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Card
                key={category._id}
                className="h-full hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                {/* Category Image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.src = `https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_auto/sample`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>

                <CardHeader>
                  <CardTitle className="text-center text-lg">
                    {category.name}
                  </CardTitle>
                </CardHeader>

                {category.description && (
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center line-clamp-2">
                      {category.description}
                    </p>
                    <Link href={`/browse?category=${category._id}`} className="block">
                      <Button variant="outline" className="w-full group/btn">
                        View Artists
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                )}

                {!category.description && (
                  <CardContent>
                    <Link href={`/browse?category=${category._id}`} className="block">
                      <Button variant="outline" className="w-full group/btn">
                        View Artists
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {categories.length > 0 && (
          <div className="mt-16 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted rounded-full">
              <span className="text-2xl font-bold">{categories.length}</span>
              <span className="text-muted-foreground">
                {categories.length === 1 ? "Category" : "Categories"} Available
              </span>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}


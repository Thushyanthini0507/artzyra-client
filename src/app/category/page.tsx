"use client";

import { useState, useMemo } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useApi";
import { getCategoryImage } from "@/lib/categoryImages";
import Link from "next/link";
import { Search, ArrowRight, Grid3x3, Layers } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-b from-[#f8f5ff] via-white to-white">
          {/* Hero Skeleton */}
          <div className="relative bg-gradient-to-br from-[#2d1b4e] via-[#3e1d56] to-[#5e3a8c] py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center space-y-8 max-w-5xl mx-auto">
                <div className="h-20 w-20 bg-white/20 rounded-2xl animate-pulse mx-auto" />
                <div className="space-y-6">
                  <div className="h-16 w-96 bg-white/20 rounded-lg animate-pulse mx-auto" />
                  <div className="h-8 w-2/3 bg-white/20 rounded animate-pulse mx-auto" />
                </div>
                <div className="h-16 w-64 bg-white/20 rounded-2xl animate-pulse mx-auto" />
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-16">
            <div className="h-14 w-full max-w-2xl bg-muted rounded-xl animate-pulse mx-auto mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="h-full border-0 shadow-md">
                  <div className="w-full h-56 bg-gradient-to-br from-purple-200 to-purple-300 animate-pulse rounded-t-lg" />
                  <CardHeader className="pb-3">
                    <div className="h-6 bg-muted rounded animate-pulse w-3/4 mx-auto" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-5/6 mx-auto" />
                    <div className="h-10 bg-muted rounded-lg animate-pulse mt-4" />
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
        <div className="min-h-screen bg-gradient-to-b from-[#f8f5ff] via-white to-white flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-[#3e1d56]">Oops!</h1>
            <p className="text-destructive text-lg">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#3e1d56] hover:bg-[#3e1d56]/90 text-white rounded-full px-8"
            >
              Try Again
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#f8f5ff] via-white to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#2d1b4e] via-[#3e1d56] to-[#5e3a8c] py-16 md:py-24 overflow-hidden">
          {/* Modern Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(179,157,219,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(45,27,78,0.8),rgba(62,29,86,0.6))]"></div>
          </div>

          {/* Geometric Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-8 max-w-5xl mx-auto">
              {/* Category Icon Badge */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <Layers className="h-10 w-10 text-white" />
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                  Explore Our
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b39ddb] via-white to-[#d4c4e8]">
                    Creative Categories
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
                  Discover talented artists across diverse creative fields. 
                  Find the perfect match for your next project.
                </p>
              </div>

              {/* Stats Card */}
              {categories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                  <div className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Grid3x3 className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-3xl font-bold text-white">
                        {categories.length}
                      </div>
                      <div className="text-sm text-white/70 font-medium">
                        {categories.length === 1 ? "Category Available" : "Categories Available"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="container mx-auto px-4 -mt-8 relative z-20">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#b39ddb] to-purple-400 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-purple-100 p-2">
                <div className="flex items-center gap-3 px-4">
                  <Search className="h-5 w-5 text-[#5e3a8c] flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Search categories by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-14 bg-transparent placeholder:text-muted-foreground"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-4 py-16">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#3e1d56]">
                  {searchQuery ? "No Results Found" : "No Categories Available"}
                </h3>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {searchQuery
                    ? `We couldn't find any categories matching "${searchQuery}". Try a different search term.`
                    : "Check back soon for new categories!"}
                </p>
              </div>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="rounded-full px-8 border-[#5e3a8c] text-[#5e3a8c] hover:bg-[#5e3a8c] hover:text-white"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category, index) => (
                <Card
                  key={category._id}
                  className="group h-full border-0 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Category Image */}
                  <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200">
                    <img
                      src={getCategoryImage(category)}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_auto/sample`;
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-[#5e3a8c]">
                        Explore
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-xl font-bold text-[#3e1d56] group-hover:text-[#5e3a8c] transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {category.description && (
                      <p className="text-sm text-muted-foreground text-center line-clamp-3 leading-relaxed min-h-[60px]">
                        {category.description}
                      </p>
                    )}

                    <Link
                      href={`/browse?category=${category._id}`}
                      className="block"
                    >
                      <Button className="w-full bg-gradient-to-r from-[#5e3a8c] to-[#3e1d56] hover:from-[#6e4a9c] hover:to-[#4e2d6e] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 group/btn">
                        View Artists
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        {categories.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <div className="relative bg-gradient-to-r from-[#3e1d56] to-[#5e3a8c] rounded-3xl p-12 md:p-16 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-top bg-no-repeat opacity-5"></div>
              <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Find Your Perfect Artist?
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Browse through our talented artists and connect with the
                  perfect match for your creative project.
                </p>
                <Link href="/browse">
                  <Button
                    size="lg"
                    className="bg-white text-[#3e1d56] hover:bg-white/90 rounded-full px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Browse All Artists
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/useBookingFlow";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getCategoryImage } from "@/lib/categoryImages";

interface CategorySelectorProps {
  onSelect: (categoryId: string) => void;
}

export function CategorySelector({ onSelect }: CategorySelectorProps) {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Select a Category</h2>
          <p className="text-muted-foreground text-base">Choose the type of service you need</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
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
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Select a Category</h2>
          <p className="text-muted-foreground text-base">Choose the type of service you need</p>
        </div>
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Select a Category</h2>
          <p className="text-muted-foreground text-base">Choose the type of service you need</p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold">Select a Category</h2>
        <p className="text-muted-foreground text-base">Choose the type of service you need</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category._id}
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg overflow-hidden flex flex-col"
            onClick={() => onSelect(category._id)}
          >
            {/* Category Image */}
            <div className="relative w-full h-48 overflow-hidden bg-muted">
              <img
                src={getCategoryImage(category)}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to Cloudinary sample image
                  e.currentTarget.src = `https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_auto/sample`;
                }}
              />
            </div>
            <CardHeader className="flex-1">
              <CardTitle className="text-lg font-bold mb-2">{category.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                {category.description || "Select this category"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <Button variant="outline" className="w-full">
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

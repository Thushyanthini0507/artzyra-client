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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Select a Category</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No categories available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Select a Category</h2>
        <p className="text-muted-foreground">Choose the type of service you need</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category._id}
            className="cursor-pointer hover:border-primary transition-colors overflow-hidden"
            onClick={() => onSelect(category._id)}
          >
            {/* Category Image */}
            <div className="relative w-full h-48 overflow-hidden">
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
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description || "Select this category"}</CardDescription>
            </CardHeader>
            <CardContent>
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

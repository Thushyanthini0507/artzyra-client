import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategoryImage } from "@/lib/categoryImages";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

interface CategoryGridProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function CategoryGrid({ categories, loading, error }: CategoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-full">
            <div className="w-full h-48 bg-gray-200 animate-pulse" />
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Error loading categories: {error}</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No categories available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {categories.slice(0, 6).map((category) => (
        <Card key={category._id} className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          {/* Category Image */}
          <div className="relative w-full h-56 overflow-hidden">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
            <img
              src={getCategoryImage(category)}
              alt={category.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                // Fallback to Cloudinary sample image
                e.currentTarget.src = `https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_auto/sample`;
              }}
            />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl text-gray-800">{category.name}</CardTitle>
          </CardHeader>
          {category.description && (
            <CardContent className="space-y-4 pt-0">
              <p className="text-sm text-muted-foreground text-center line-clamp-2 px-2">
                {category.description}
              </p>
              <Link href={`/browse?category=${category._id}`} className="block pt-2">
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors">
                  View Details
                </Button>
              </Link>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
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
    return <Loader />;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link href={`/browse?category=${category._id}`} key={category._id}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden">
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
              <CardTitle className="text-center">{category.name}</CardTitle>
            </CardHeader>
            {category.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground text-center line-clamp-3">
                  {category.description}
                </p>
              </CardContent>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}

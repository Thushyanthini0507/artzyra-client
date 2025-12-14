import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategoryImage } from "@/lib/categoryImages";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Determine which half of the container the mouse is in
    if (mouseX < containerWidth / 2) {
      setHoveredSide('left');
    } else {
      setHoveredSide('right');
    }
  };

  const handleMouseLeave = () => {
    setHoveredSide(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-full">
            <div className="w-full h-48 bg-gray-200 animate-pulse" />
            <CardContent className="p-4">
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
    <div 
      className="relative" 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Arrow - shows only when hovering left half */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 text-gray-800 hover:bg-gray-50 transition-all ${
          hoveredSide === 'left' ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Link href={`/browse?category=${category._id}`} key={category._id} className="min-w-[280px] md:min-w-[320px] snap-center">
            <Card className="h-full border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-gray-50/50">
              {/* Category Image */}
              <div className="relative w-full h-48 overflow-hidden rounded-t-xl m-2 mb-0">
                <img
                  src={getCategoryImage(category)}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = `https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_auto/sample`;
                  }}
                />
              </div>
              
              <CardContent className="p-6 text-left">
                {category.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    "{category.description}"
                  </p>
                )}
                <h3 className="font-bold text-sm text-[#5e3a8c]">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Right Arrow - shows only when hovering right half */}
      <button
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 text-gray-800 hover:bg-gray-50 transition-all ${
          hoveredSide === 'right' ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}

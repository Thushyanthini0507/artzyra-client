"use client";

import { useCategories } from "@/hooks/useApi";
import { CategoryGrid } from "@/components/CategoryGrid";

export function HomeCategories() {
  const { categories, loading, error } = useCategories();

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold text-center mb-10">Explore Categories</h2>
      <CategoryGrid categories={categories} loading={loading} error={error} />
    </div>
  );
}

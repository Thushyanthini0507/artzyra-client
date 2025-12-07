"use client";

import { useCategories } from "@/hooks/useApi";
import { CategoryGrid } from "@/components/CategoryGrid";

export function HomeCategories() {
  const { categories, loading, error } = useCategories();

  return (
    <CategoryGrid categories={categories} loading={loading} error={error} />
  );
}

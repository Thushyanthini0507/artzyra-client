"use client";

import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function CustomerFavoritesPage() {
  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground">Artists you've saved</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Artists</CardTitle>
            <CardDescription>Your saved artists for quick booking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Heart className="h-16 w-16 mb-4" />
              <p className="text-lg">No favorites yet</p>
              <p className="text-sm">Browse artists and save your favorites</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}

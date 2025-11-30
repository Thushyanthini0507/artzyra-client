"use client";

import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerReviews } from "@/hooks/useCustomerHooks";
import { Star } from "lucide-react";

export default function CustomerReviewsPage() {
  const { reviews, loading } = useCustomerReviews();

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Reviews</h1>
          <p className="text-muted-foreground">Reviews you've left for artists</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Review History</CardTitle>
            <CardDescription>Your feedback matters</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews found.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {typeof review.artist === 'string' ? 'Artist' : review.artist.name}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}

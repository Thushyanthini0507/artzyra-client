"use client";

import { useEffect, useState } from "react";
import { ArtistLayout } from "@/components/layout/artist-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { artistService } from "@/services/artist.service";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";

export default function ArtistReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await artistService.getReviews();
        if (response.success && response.data) {
          setReviews(response.data);
          
          // Calculate stats
          const total = response.data.length;
          const average = total > 0
            ? response.data.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / total
            : 0;
          
          setStats({
            averageRating: Math.round(average * 10) / 10,
            totalReviews: total,
          });
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <ArtistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Customer feedback and ratings</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{stats.averageRating}</div>
                {renderStars(Math.round(stats.averageRating))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.totalReviews}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reviews yet</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.customer?.profileImage} />
                        <AvatarFallback>
                          {review.customer?.name?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{review.customer?.name || "Anonymous"}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ArtistLayout>
  );
}

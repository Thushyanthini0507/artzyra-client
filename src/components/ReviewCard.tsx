import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/types/review";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const customerName = typeof review.customer === 'object' ? review.customer?.name : "Anonymous Customer";
  const customerImage = typeof review.customer === 'object' ? review.customer?.profileImage : null;
  const artistName = typeof review.artist === 'object' ? review.artist?.name : null;

  return (
    <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
            {customerImage ? (
              <img
                src={customerImage}
                alt={customerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="space-y-2 w-full">
            <div className="flex justify-between items-start w-full">
              <div>
                <h4 className="font-bold text-lg text-gray-900">
                  {customerName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {review.createdAt
                    ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                    : "Recently"}
                </p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed pt-2">
              &quot;{review.comment}&quot;
            </p>
            {artistName && (
              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="text-xs text-muted-foreground">
                  Review for artist: <span className="font-medium text-primary">{artistName}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

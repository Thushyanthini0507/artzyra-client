import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    const normalized = status.toLowerCase();
    
    switch (normalized) {
      case "confirmed":
      case "accepted":
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in_progress":
      case "in progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "declined":
      case "rejected":
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed":
      case "succeeded":
      case "paid":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "pending":
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
      case "canceled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "refunded":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("capitalize border", getStatusStyles(status), className)}
    >
      {status}
    </Badge>
  );
}

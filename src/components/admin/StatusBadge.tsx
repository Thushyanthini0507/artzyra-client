import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "completed":
      case "active":
      case "accepted":
        return "default"; // Usually black/primary
      case "pending":
      case "processing":
        return "secondary"; // Usually gray/muted
      case "rejected":
      case "failed":
      case "cancelled":
        return "destructive"; // Red
      default:
        return "outline";
    }
  };

  return (
    <Badge variant={getVariant(status)} className={cn("capitalize", className)}>
      {status}
    </Badge>
  );
}

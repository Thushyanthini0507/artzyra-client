"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { bookingService } from "@/services/booking.service";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Booking } from "@/types/booking";

interface BookingApprovalProps {
  booking: Booking;
  onSuccess?: () => void;
}

export function BookingApproval({ booking, onSuccess }: BookingApprovalProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await bookingService.approveBooking(booking._id, { notes: notes.trim() || undefined });
      toast.success("Booking approved successfully!");
      setNotes("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve booking");
    } finally {
      setLoading(false);
    }
  };

  if (booking.status !== "review") {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This booking is not in review status. Approval is only available when the booking is in review.
        </AlertDescription>
      </Alert>
    );
  }

  if (booking.finalApproval?.approved) {
    return (
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          This booking has already been approved on{" "}
          {booking.finalApproval.approvedAt
            ? new Date(booking.finalApproval.approvedAt).toLocaleDateString()
            : ""}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Approve Booking
        </CardTitle>
        <CardDescription>
          Review the completed work and approve if it meets your requirements. Once approved, payment will be released to the artist.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Before approving:</p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Review all deliverables carefully</li>
            <li>Ensure all requirements have been met</li>
            <li>Check that revisions (if any) have been addressed</li>
            <li>Once approved, payment will be automatically released</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalNotes">Additional Notes (Optional)</Label>
          <Textarea
            id="approvalNotes"
            placeholder="Add any additional notes or feedback..."
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            onClick={handleApprove}
            disabled={loading}
            className="min-w-[150px]"
          >
            {loading ? "Approving..." : "Approve & Release Payment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}





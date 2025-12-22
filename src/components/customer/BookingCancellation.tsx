"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { bookingService } from "@/services/booking.service";
import { toast } from "sonner";
import { XCircle, AlertCircle, Info } from "lucide-react";
import { Booking } from "@/types/booking";

interface BookingCancellationProps {
  booking: Booking;
  onSuccess?: () => void;
}

export function BookingCancellation({ booking, onSuccess }: BookingCancellationProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const canCancel = !["completed", "cancelled"].includes(booking.status);
  const cancellationWindow = booking.cancellation?.cancellationWindow || 24; // hours
  const estimatedStartDate = booking.estimatedStartDate 
    ? new Date(booking.estimatedStartDate) 
    : booking.bookingDate 
    ? new Date(booking.bookingDate)
    : null;
  
  const now = new Date();
  const hoursUntilStart = estimatedStartDate 
    ? (estimatedStartDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    : null;

  const getRefundInfo = () => {
    if (!canCancel) return null;
    
    if (booking.status === "pending" || (hoursUntilStart && hoursUntilStart > cancellationWindow)) {
      return {
        type: "full" as const,
        message: "Full refund will be processed as work has not started.",
      };
    } else if (booking.status === "in_progress") {
      return {
        type: "partial" as const,
        message: "Partial refund (50%) will be processed as work has started.",
      };
    }
    return null;
  };

  const refundInfo = getRefundInfo();

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setLoading(true);
    try {
      const response = await bookingService.cancelBooking(booking._id, { reason });
      toast.success(
        response.data?.refundAmount > 0
          ? `Booking cancelled. Refund of ${response.data.refundAmount} will be processed.`
          : "Booking cancelled successfully."
      );
      setReason("");
      setShowDialog(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  if (!canCancel) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This booking cannot be cancelled as it is already {booking.status}.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <XCircle className="h-5 w-5" />
          Cancel Booking
        </CardTitle>
        <CardDescription>
          Cancel this booking. Refund rules apply based on the booking status and cancellation window.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {refundInfo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Refund Information:</strong> {refundInfo.message}
              {hoursUntilStart && hoursUntilStart > 0 && (
                <span className="block mt-1">
                  Time until start: {Math.floor(hoursUntilStart)} hours
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Cancellation Rules:</p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Full refund if cancelled before work starts (24+ hours before start)</li>
            <li>Partial refund (50%) if work has started</li>
            <li>No refund if booking is completed</li>
            <li>Cancellation window: {cancellationWindow} hours</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cancellationReason">Reason for Cancellation *</Label>
          <Textarea
            id="cancellationReason"
            placeholder="Please provide a reason for cancelling this booking..."
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
          />
        </div>

        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Cancel Booking
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will cancel the booking
                {refundInfo && ` and ${refundInfo.type === "full" ? "process a full" : "process a partial"} refund`}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>No, keep booking</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                disabled={loading || !reason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? "Cancelling..." : "Yes, cancel booking"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}















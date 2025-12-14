"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { bookingService } from "@/services/booking.service";
import { toast } from "sonner";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Booking } from "@/types/booking";

interface BookingRevisionRequestProps {
  booking: Booking;
  onSuccess?: () => void;
}

export function BookingRevisionRequest({ booking, onSuccess }: BookingRevisionRequestProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const revisionCount = booking.revisionCount || { used: 0, limit: 3 };
  const canRequestRevision = revisionCount.used < revisionCount.limit;
  const remainingRevisions = revisionCount.limit - revisionCount.used;

  const handleRequestRevision = async () => {
    if (!description.trim()) {
      toast.error("Please provide a description of the changes needed");
      return;
    }

    if (!canRequestRevision) {
      toast.error(`Revision limit (${revisionCount.limit}) has been reached`);
      return;
    }

    setLoading(true);
    try {
      await bookingService.requestRevision(booking._id, { description });
      toast.success("Revision requested successfully");
      setDescription("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to request revision");
    } finally {
      setLoading(false);
    }
  };

  if (booking.status !== "review") {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Revisions can only be requested when the booking is in review status.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Request Revision
        </CardTitle>
        <CardDescription>
          Request changes to the completed work. You have {remainingRevisions} revision{remainingRevisions !== 1 ? "s" : ""} remaining.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canRequestRevision && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have reached the revision limit ({revisionCount.limit}). No more revisions can be requested.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="revisionDescription">
            Describe the changes needed *
          </Label>
          <Textarea
            id="revisionDescription"
            placeholder="Please describe what changes you would like to be made..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!canRequestRevision || loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Revisions used: {revisionCount.used} / {revisionCount.limit}
          </div>
          <Button
            onClick={handleRequestRevision}
            disabled={!canRequestRevision || loading || !description.trim()}
          >
            {loading ? "Requesting..." : "Request Revision"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}




"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePendingArtists, useApproveArtist, useRejectArtist } from "@/hooks/useAdminHooks";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PendingArtistsPage() {
  const { artists, loading, refresh } = usePendingArtists();
  const { approveArtist, loading: approving } = useApproveArtist();
  const { rejectArtist, loading: rejecting } = useRejectArtist();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async (artistId: string) => {
    const result = await approveArtist(artistId);
    if (result.success) {
      refresh();
    }
  };

  const handleRejectClick = (artist: any) => {
    setSelectedArtist(artist);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (selectedArtist) {
      const result = await rejectArtist(selectedArtist._id, rejectionReason);
      if (result.success) {
        setRejectDialogOpen(false);
        setSelectedArtist(null);
        setRejectionReason("");
        refresh();
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pending Artists</h1>
          <p className="text-muted-foreground">Review and approve artist registrations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Artists waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border p-4 rounded-lg space-y-2">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : artists.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No pending artists</p>
            ) : (
              <div className="space-y-4">
                {artists.map((artist) => (
                  <div key={artist._id} className="border p-4 rounded-lg space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={artist.profileImage} alt={artist.name} />
                        <AvatarFallback>{artist.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{artist.name}</h3>
                        <p className="text-sm text-muted-foreground">{artist.email}</p>
                        <p className="text-sm text-muted-foreground">{artist.phone}</p>
                        {artist.category && (
                          <Badge variant="outline" className="mt-2">
                            {typeof artist.category === 'object' ? artist.category.name : artist.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {artist.bio && (
                      <div>
                        <p className="text-sm font-medium">Bio:</p>
                        <p className="text-sm text-muted-foreground">{artist.bio}</p>
                      </div>
                    )}

                    {artist.skills && artist.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {artist.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {artist.hourlyRate && (
                      <div>
                        <p className="text-sm font-medium">Hourly Rate: ₹{artist.hourlyRate}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleApprove(artist._id)}
                        disabled={approving || rejecting}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleRejectClick(artist)}
                        disabled={approving || rejecting}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Artist</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting {selectedArtist?.name}'s application
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete profile, insufficient experience..."
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectConfirm} disabled={rejecting}>
                {rejecting ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

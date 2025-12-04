"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/services/adminService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export default function PendingArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingArtists = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPendingArtists();
      if (response.success && response.data) {
        setArtists(response.data as any[]);
      }
    } catch (error) {
      console.error("Failed to fetch pending artists", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArtists();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveArtist(id);
      toast.success("Artist approved successfully");
      fetchPendingArtists();
    } catch (error) {
      toast.error("Failed to approve artist");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectArtist(id);
      toast.success("Artist rejected");
      fetchPendingArtists();
    } catch (error) {
      toast.error("Failed to reject artist");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Artists</h1>
        <p className="text-muted-foreground">Review and approve artist applications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artist</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : artists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No pending applications.
                  </TableCell>
                </TableRow>
              ) : (
                artists.map((artist) => (
                  <TableRow key={artist._id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={artist.profileImage} />
                        <AvatarFallback>{artist.name?.charAt(0) || "A"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{artist.name}</div>
                        <div className="text-sm text-muted-foreground">{artist.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{artist.category?.name || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(artist.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(artist._id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(artist._id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

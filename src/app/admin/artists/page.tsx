"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { nextApi } from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  category?: string;
  vehicleType?: string;
  createdAt: string;
}

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      console.log("Fetching artists...");
      const response = await nextApi.get<User[]>("/api/admin/users?role=artist");
      console.log("Artists response:", response);
      
      if (response.success && response.data) {
        console.log("Setting artists:", response.data);
        setArtists(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error("Failed to fetch artists:", response.error);
        toast.error(response.error || "Failed to fetch artists");
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
      toast.error("Failed to fetch artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleAction = async () => {
    if (!selectedUser || !actionType) return;

    const status = actionType === "approve" ? "approved" : "rejected";
    const response = await nextApi.put("/api/admin/users", {
      userId: selectedUser._id,
      status,
    });

    if (response.success) {
      toast.success(`Artist ${status} successfully`);
      fetchArtists();
    } else {
      toast.error(response.error || "Failed to update status");
    }

    setSelectedUser(null);
    setActionType(null);
  };

  const openDialog = (user: User, action: "approve" | "reject") => {
    setSelectedUser(user);
    setActionType(action);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Artist Management</h1>
          <p className="text-muted-foreground">Approve or reject artist registrations</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : artists.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No artists found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {artists.map((artist) => (
              <Card key={artist._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{artist.name}</CardTitle>
                      <CardDescription>{artist.email}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        artist.status === "approved"
                          ? "default"
                          : artist.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {artist.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {artist.category && (
                      <p className="text-sm">
                        <span className="font-medium">Category:</span> {artist.category}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Registered: {new Date(artist.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {artist.status === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => openDialog(artist, "approve")}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDialog(artist, "reject")}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Artist
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} {selectedUser?.name}? This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

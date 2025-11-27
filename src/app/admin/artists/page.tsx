"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Artist {
  id: string;
  shopName: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  category: string;
  skills: string;
  hourlyRate: string;
  availability: string;
  status: string;
  createdAt: string;
}

export default function ArtistApprovalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  const fetchArtists = async () => {
    setLoadingData(true);
    const response = await api.get<Artist[]>("/api/admin/artists/pending");
    if (response.success && response.data) {
      setArtists(response.data);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchArtists();
    }
  }, [user]);



  const handleAction = async () => {
    if (!selectedArtist || !action) return;

    setProcessing(true);
    const endpoint = `/api/admin/artists/${selectedArtist.id}/${action}`;
    const response = await api.put(endpoint);

    if (response.success) {
      toast.success(`Artist ${action === "approve" ? "approved" : "rejected"} successfully`);
      setArtists(artists.filter((a) => a.id !== selectedArtist.id));
    } else {
      toast.error(response.error || "Action failed");
    }

    setProcessing(false);
    setSelectedArtist(null);
    setAction(null);
  };

  if (loading || !user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Artist Approvals</h1>

        {loadingData ? (
          <p>Loading...</p>
        ) : artists.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No pending artist registrations</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {artists.map((artist) => (
              <Card key={artist.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{artist.shopName}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {artist.name} - {artist.email}
                      </p>
                    </div>
                    <Badge variant="secondary">{artist.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{artist.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-gray-600">{artist.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Hourly Rate</p>
                      <p className="text-sm text-gray-600">${artist.hourlyRate}/hr</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Availability</p>
                      <p className="text-sm text-gray-600">{artist.availability}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium">Skills</p>
                      <p className="text-sm text-gray-600">{artist.skills}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium">Bio</p>
                      <p className="text-sm text-gray-600">{artist.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedArtist(artist);
                        setAction("approve");
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedArtist(artist);
                        setAction("reject");
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!selectedArtist && !!action} onOpenChange={() => {
          setSelectedArtist(null);
          setAction(null);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {action === "approve" ? "Approve Artist" : "Reject Artist"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {action} {selectedArtist?.shopName}? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAction} disabled={processing}>
                {processing ? "Processing..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

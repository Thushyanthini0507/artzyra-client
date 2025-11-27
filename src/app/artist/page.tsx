"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ArtistLayout } from "@/components/layouts/artist-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArtistDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "artist")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "artist") {
    return null;
  }

  return (
    <ArtistLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user.name}!</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Portfolio</CardTitle>
              <CardDescription>Showcase your best work</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Upload and manage your creative portfolio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Current client projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track your ongoing commissions and deadlines
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
              <CardDescription>Your financial overview</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View your earnings and payment history
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ArtistLayout>
  );
}

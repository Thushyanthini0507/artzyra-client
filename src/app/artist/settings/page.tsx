"use client";

import { ArtistLayout } from "@/components/layout/artist-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function ArtistSettingsPage() {
  return (
    <ArtistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Configure your artist account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <SettingsIcon className="h-16 w-16 mb-4" />
              <p className="text-lg">Settings page coming soon</p>
              <p className="text-sm">Update your profile in the Profile page</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ArtistLayout>
  );
}

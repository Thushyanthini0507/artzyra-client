"use client";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function ArtistSettingsPage() {
  return (

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account preferences</p>
        </div>

        <Card className="border-none bg-[#1e1b29]">
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
            <CardDescription className="text-gray-400">Configure your artist account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <SettingsIcon className="h-16 w-16 mb-4" />
              <p className="text-lg">Settings page coming soon</p>
              <p className="text-sm">Update your profile in the Profile page</p>
            </div>
          </CardContent>
        </Card>
      </div>

  );
}

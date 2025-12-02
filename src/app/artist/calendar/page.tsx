"use client";

import { useState } from "react";
import { ArtistLayout } from "@/components/layout/artist-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function ArtistCalendarPage() {
  return (
    <ArtistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View your booking schedule</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Booking Calendar</CardTitle>
            <CardDescription>Your upcoming appointments and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CalendarIcon className="h-16 w-16 mb-4" />
              <p className="text-lg">Calendar view coming soon</p>
              <p className="text-sm">View all your bookings in the Bookings page</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ArtistLayout>
  );
}

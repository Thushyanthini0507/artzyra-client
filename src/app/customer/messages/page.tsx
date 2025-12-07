"use client";

import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function CustomerMessagesPage() {
  return (
    <CustomerLayout>
      <div className="p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Chat with artists</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Messages</CardTitle>
            <CardDescription>Conversations with artists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Mail className="h-16 w-16 mb-4" />
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start a conversation with an artist</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}

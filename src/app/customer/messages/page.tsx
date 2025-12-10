"use client";

import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function CustomerMessagesPage() {
  return (
    <CustomerLayout>
      <main className="flex-1 p-8 overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white">Messages</h1>
            <p className="text-gray-400">Chat with artists</p>
          </div>

          <Card className="bg-[#1e1b29] border-white/5 shadow-xl min-h-[400px]">
            <CardHeader>
              <CardTitle className="text-white">Your Messages</CardTitle>
              <CardDescription className="text-gray-400">Conversations with artists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="h-20 w-20 bg-[#5b21b6]/10 rounded-full flex items-center justify-center mb-6">
                   <Mail className="h-10 w-10 text-[#5b21b6]" />
                </div>
                <p className="text-xl font-semibold text-white mb-2">No messages yet</p>
                <p className="text-sm">Start a conversation with an artist to see it here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </CustomerLayout>
  );
}

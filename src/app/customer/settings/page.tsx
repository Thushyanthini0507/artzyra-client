"use client";

import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare } from "lucide-react";

export default function CustomerSettingsPage() {
  return (
    <CustomerLayout>
      <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-500 mb-8">Manage your account preferences</p>

          <div className="space-y-6">
            {/* Notifications Settings */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Notifications</CardTitle>
                <CardDescription className="text-gray-500">
                  Choose what you want to be notified about
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label htmlFor="booking-notifications" className="text-gray-900 font-medium">
                        Booking Updates
                      </Label>
                      <p className="text-sm text-gray-500">Get notified about booking confirmations and updates</p>
                    </div>
                  </div>
                  <Switch id="booking-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label htmlFor="message-notifications" className="text-gray-900 font-medium">
                        New Messages
                      </Label>
                      <p className="text-sm text-gray-500">Get notified when you receive a new message</p>
                    </div>
                  </div>
                  <Switch id="message-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label htmlFor="email-notifications" className="text-gray-900 font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                    </div>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Privacy</CardTitle>
                <CardDescription className="text-gray-500">
                  Control your privacy preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility" className="text-gray-900 font-medium">
                      Profile Visibility
                    </Label>
                    <p className="text-sm text-gray-500">Make your profile visible to artists</p>
                  </div>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon Placeholder */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">More settings coming soon...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}

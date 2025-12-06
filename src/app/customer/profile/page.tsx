"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customerService } from "@/services/customer.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { isValidSriLankanPhone, normalizeSriLankanPhone } from "@/lib/utils/phoneValidation";

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    dateOfBirth: "",
    gender: "",
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
      favoriteCategories: [] as string[],
    },
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await customerService.getProfile();
        if (response.success && response.data) {
          const data = response.data.customer || response.data;
          const user = response.data.user || {};
          setProfile(data);
          setFormData({
            name: data.name || "",
            email: user.email || data.email || "",
            phone: data.phone || "",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              zipCode: data.address?.zipCode || "",
              country: data.address?.country || "",
            },
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : "",
            gender: data.gender || "",
            preferences: data.preferences || {
              notifications: true,
              emailUpdates: true,
              smsUpdates: false,
              favoriteCategories: [],
            },
            socialLinks: data.socialLinks || {
              facebook: "",
              instagram: "",
              twitter: "",
            },
            emergencyContact: data.emergencyContact || {
              name: "",
              phone: "",
              relationship: "",
            },
            bio: data.bio || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate phone numbers if provided
      if (formData.phone && !isValidSriLankanPhone(formData.phone)) {
        toast.error("Please provide a valid Sri Lankan phone number (e.g., 0712345678 or 712345678)");
        setSaving(false);
        return;
      }
      if (formData.emergencyContact.phone && !isValidSriLankanPhone(formData.emergencyContact.phone)) {
        toast.error("Please provide a valid Sri Lankan phone number for emergency contact (e.g., 0712345678 or 712345678)");
        setSaving(false);
        return;
      }

      const response = await customerService.updateProfile({
        name: formData.name,
        phone: formData.phone ? normalizeSriLankanPhone(formData.phone) : "",
        address: formData.address,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        preferences: formData.preferences,
        socialLinks: formData.socialLinks,
        emergencyContact: {
          ...formData.emergencyContact,
          phone: formData.emergencyContact.phone ? normalizeSriLankanPhone(formData.emergencyContact.phone) : "",
        },
        bio: formData.bio,
      });

      if (response.success) {
        toast.success("Profile updated successfully");
        setProfile(response.data);
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, zipCode: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.address.country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, country: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      type="url"
                      placeholder="https://facebook.com/yourprofile"
                      value={formData.socialLinks.facebook}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      type="url"
                      placeholder="https://instagram.com/yourprofile"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      type="url"
                      placeholder="https://twitter.com/yourprofile"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone (Sri Lankan format)</Label>
                    <Input
                      id="emergencyPhone"
                      placeholder="0712345678 or 712345678"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                      })}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value && isValidSriLankanPhone(value)) {
                          setFormData({
                            ...formData,
                            emergencyContact: { ...formData.emergencyContact, phone: normalizeSriLankanPhone(value) },
                          });
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: 0712345678 or 712345678
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      placeholder="e.g., Spouse, Parent, Friend"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, relationship: e.target.value },
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={formData.preferences.notifications}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, notifications: e.target.checked },
                      })}
                      className="rounded"
                    />
                    <Label htmlFor="notifications">Enable Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailUpdates"
                      checked={formData.preferences.emailUpdates}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, emailUpdates: e.target.checked },
                      })}
                      className="rounded"
                    />
                    <Label htmlFor="emailUpdates">Email Updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="smsUpdates"
                      checked={formData.preferences.smsUpdates}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, smsUpdates: e.target.checked },
                      })}
                      className="rounded"
                    />
                    <Label htmlFor="smsUpdates">SMS Updates</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </CustomerLayout>
  );
}

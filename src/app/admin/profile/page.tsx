"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { isValidSriLankanPhone, normalizeSriLankanPhone } from "@/lib/utils/phoneValidation";
import { ImageUpload } from "@/components/ui/image-upload";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    department: "",
    position: "",
    profileImage: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
    location: {
      city: "",
      state: "",
      country: "",
    },
    permissions: [] as string[],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await adminService.getProfile();
        if (response.success && response.data) {
          const data = response.data.admin || response.data;
          const user = response.data.user || {};
          setProfile(data);
          setFormData({
            name: data.name || "",
            email: user.email || data.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
            department: data.department || "",
            position: data.position || "",
            profileImage: data.profileImage || "",
            socialLinks: data.socialLinks || {
              facebook: "",
              instagram: "",
              twitter: "",
              linkedin: "",
            },
            location: data.location || {
              city: "",
              state: "",
              country: "",
            },
            permissions: Array.isArray(data.permissions) ? data.permissions : [],
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
      // Validate phone number if provided
      if (formData.phone && !isValidSriLankanPhone(formData.phone)) {
        toast.error("Please provide a valid Sri Lankan phone number (e.g., 0712345678 or 712345678)");
        setSaving(false);
        return;
      }

      const response = await adminService.updateProfile({
        name: formData.name,
        phone: formData.phone ? normalizeSriLankanPhone(formData.phone) : "",
        bio: formData.bio,
        department: formData.department,
        position: formData.position,
        profileImage: formData.profileImage,
        socialLinks: formData.socialLinks,
        location: formData.location,
        permissions: formData.permissions,
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
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="text-muted-foreground">Manage your admin profile information</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <ImageUpload
                  value={formData.profileImage}
                  onChange={(url) => setFormData({ ...formData, profileImage: url })}
                  imageType="admin_profile"
                />
              </div>
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

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Sri Lankan format)</Label>
                  <Input
                    id="phone"
                    placeholder="0712345678 or 712345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value && isValidSriLankanPhone(value)) {
                        setFormData({ ...formData, phone: normalizeSriLankanPhone(value) });
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: 0712345678 or 712345678
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="e.g., Operations, Support, Management"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    placeholder="e.g., Manager, Administrator, Director"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
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
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.location.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.location.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, state: e.target.value },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.location.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, country: e.target.value },
                      })}
                    />
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
    </AdminLayout>
  );
}


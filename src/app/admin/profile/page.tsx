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
import { Loader2, User, Mail, Phone, MapPin, Briefcase, Globe, Save } from "lucide-react";
import { isValidSriLankanPhone, normalizeSriLankanPhone } from "@/lib/utils/phoneValidation";
import { ImageUpload } from "@/components/ui/image-upload";
import { PhoneInput } from "@/components/ui/phone-input";

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
            phone: data.phone || "+94",
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
      if (formData.phone && !isValidSriLankanPhone(formData.phone)) {
        toast.error("Please provide a valid Sri Lankan phone number");
        setSaving(false);
        return;
      }

      const response = await adminService.updateProfile({
        name: formData.name,
        phone: formData.phone && formData.phone.trim() ? normalizeSriLankanPhone(formData.phone) : "",
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
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Admin Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and account settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Header Card */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="-mt-16">
                  <div className="rounded-full p-1 bg-[#13111c]">
                    <ImageUpload
                      value={formData.profileImage}
                      onChange={(url) => setFormData({ ...formData, profileImage: url })}
                      imageType="admin_profile"
                    />
                  </div>
                </div>
                <div className="mt-4 flex-1 space-y-1">
                  <h2 className="text-2xl font-bold text-white">{formData.name || "Admin User"}</h2>
                  <p className="text-purple-400 font-medium">{formData.position || "Administrator"}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {formData.email}
                    </div>
                    {formData.department && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {formData.department}
                      </div>
                    )}
                    {formData.location.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {formData.location.city}, {formData.location.country}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Info */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-400" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-gray-400">Basic details about you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    className="bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <PhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-black/20 border-white/10 text-white focus:border-purple-500/50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Professional Info */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                    Professional Details
                  </CardTitle>
                  <CardDescription className="text-gray-400">Your role within the organization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-gray-300">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-gray-300">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                    Location
                  </CardTitle>
                  <CardDescription className="text-gray-400">Where you are based</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">City</Label>
                      <Input
                        id="city"
                        value={formData.location.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, city: e.target.value },
                        })}
                        className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-gray-300">Country</Label>
                      <Input
                        id="country"
                        value={formData.location.country}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, country: e.target.value },
                        })}
                        className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-pink-400" />
                    Social Profiles
                  </CardTitle>
                  <CardDescription className="text-gray-400">Connect your social media accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-gray-300">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/..."
                        value={formData.socialLinks.linkedin}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                        })}
                        className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-gray-300">Twitter</Label>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/..."
                        value={formData.socialLinks.twitter}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                        })}
                        className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

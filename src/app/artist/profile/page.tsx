"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { artistService } from "@/services/artist.service";
import { categoryService } from "@/services/category.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { isValidSriLankanPhone, normalizeSriLankanPhone } from "@/lib/utils/phoneValidation";
import { ImageUpload } from "@/components/ui/image-upload";
import { PhoneInput } from "@/components/ui/phone-input";

export default function ArtistProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    profileImage: "",
    email: "",
    phone: "",
    bio: "",
    category: "",
    skills: "",
    hourlyRate: "",
    availability: "",
    portfolio: "",
    website: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
    experience: {
      years: "",
      description: "",
    },
    education: [] as any[],
    certifications: [] as any[],
    languages: "",
    location: {
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, categoriesRes] = await Promise.all([
          artistService.getProfile(),
          categoryService.getAllCategories(),
        ]);

        if (profileRes.success && profileRes.data) {
          const data = profileRes.data.artist || profileRes.data;
          const user = profileRes.data.user || {};
          setProfile(data);
          setFormData({
            name: data.name || "",
            profileImage: data.profileImage || "",
            email: user.email || data.email || "",
            phone: data.phone || "+94",
            bio: data.bio || "",
            category: data.category?._id || "",
            skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
            hourlyRate: data.hourlyRate?.toString() || "",
            availability: typeof data.availability === "string" ? data.availability : "",
            portfolio: Array.isArray(data.portfolio) ? data.portfolio.join(", ") : "",
            website: data.website || "",
            socialLinks: data.socialLinks || {
              facebook: "",
              instagram: "",
              twitter: "",
              linkedin: "",
              youtube: "",
            },
            experience: data.experience || { years: "", description: "" },
            education: Array.isArray(data.education) ? data.education : [],
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            languages: Array.isArray(data.languages) ? data.languages.join(", ") : "",
            location: data.location || { city: "", state: "", country: "", zipCode: "" },
          });
        }

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

      const updateData = {
        name: formData.name,
        profileImage: formData.profileImage,
        phone: formData.phone ? normalizeSriLankanPhone(formData.phone) : undefined,
        bio: formData.bio,
        category: formData.category,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        availability: formData.availability,
        portfolio: formData.portfolio.split(",").map((p) => p.trim()).filter(Boolean),
        website: formData.website,
        socialLinks: formData.socialLinks,
        experience: {
          years: parseInt(formData.experience.years) || 0,
          description: formData.experience.description,
        },
        education: formData.education,
        certifications: formData.certifications,
        languages: formData.languages.split(",").map((l) => l.trim()).filter(Boolean),
        location: formData.location,
      };

      const response = await artistService.updateProfile(updateData);
      
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
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your artist profile information</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-none bg-[#1e1b29]">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <ImageUpload
                  value={formData.profileImage}
                  onChange={(url) => setFormData({ ...formData, profileImage: url })}
                  imageType="artist_profile"
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
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-white/5 border-white/10 opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <PhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e1b29] border-white/10">
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (LKR)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    placeholder="e.g., Mon-Fri, 9AM-5PM"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell customers about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="e.g., Portrait, Landscape, Digital Art"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio URLs (comma-separated)</Label>
                <Input
                  id="portfolio"
                  placeholder="e.g., https://example.com/work1, https://example.com/work2"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-white/5 border-white/10"
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
                      className="bg-white/5 border-white/10"
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
                      className="bg-white/5 border-white/10"
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
                      className="bg-white/5 border-white/10"
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
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      type="url"
                      placeholder="https://youtube.com/@yourchannel"
                      value={formData.socialLinks.youtube}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                      })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Experience</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">Years of Experience</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min="0"
                      value={formData.experience.years}
                      onChange={(e) => setFormData({
                        ...formData,
                        experience: { ...formData.experience, years: e.target.value },
                      })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="experienceDesc">Experience Description</Label>
                    <Textarea
                      id="experienceDesc"
                      rows={3}
                      placeholder="Describe your professional experience..."
                      value={formData.experience.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        experience: { ...formData.experience, description: e.target.value },
                      })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages (comma-separated)</Label>
                <Input
                  id="languages"
                  placeholder="e.g., English, Sinhala, Tamil"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
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
                      className="bg-white/5 border-white/10"
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
                      className="bg-white/5 border-white/10"
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
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.location.zipCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, zipCode: e.target.value },
                      })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={saving} className="bg-[#5b21b6] hover:bg-[#4c1d95]">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

  );
}

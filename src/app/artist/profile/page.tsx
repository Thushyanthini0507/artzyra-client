"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { normalizeSriLankanPhone } from "@/lib/utils/phoneValidation";
import { ImageUpload } from "@/components/ui/image-upload";
import { PhoneInput } from "@/components/ui/phone-input";
import { artistProfileSchema, type ArtistProfileFormData } from "@/lib/validations/artist";

export default function ArtistProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ArtistProfileFormData>({
    resolver: zodResolver(artistProfileSchema),
    defaultValues: {
      name: "",
      profileImage: "",
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
      languages: "",
      location: {
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
    },
  });

  const profileImage = watch("profileImage");

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
          setUserEmail(user.email || data.email || "");
          
          // Reset form with fetched data
          reset({
            name: data.name || "",
            profileImage: data.profileImage || "",
            phone: data.phone || "",
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
  }, [reset]);

  const onSubmit = async (data: ArtistProfileFormData) => {
    setSaving(true);

    try {
      const updateData = {
        name: data.name,
        profileImage: data.profileImage || "",
        phone: data.phone ? normalizeSriLankanPhone(data.phone) : undefined,
        bio: data.bio,
        category: data.category,
        skills: data.skills ? data.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : 0,
        availability: data.availability,
        portfolio: data.portfolio ? data.portfolio.split(",").map((p) => p.trim()).filter(Boolean) : [],
        website: data.website,
        socialLinks: data.socialLinks || {},
        experience: {
          years: data.experience?.years ? parseInt(data.experience.years) : 0,
          description: data.experience?.description || "",
        },
        languages: data.languages ? data.languages.split(",").map((l) => l.trim()).filter(Boolean) : [],
        location: data.location || {},
      };

      const response = await artistService.updateProfile(updateData);
      
      if (response.success) {
        toast.success("Profile updated successfully");
        setProfile(response.data);
        // Refresh the page to update profile image everywhere
        window.location.reload();
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
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400">Manage your artist profile information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-none bg-[#1e1b29]">
          <CardHeader>
            <CardTitle className="text-white">Personal Information</CardTitle>
            <CardDescription className="text-gray-400">Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <Controller
                name="profileImage"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    imageType="artist_profile"
                  />
                )}
              />
              {errors.profileImage && (
                <p className="text-sm text-red-400 mt-1">{errors.profileImage.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-white/5 border-white/10 opacity-50 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      id="phone"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-sm text-red-400">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">Category *</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`bg-white/5 border-white/10 text-white ${
                        errors.category ? "border-red-500" : ""
                      }`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e1b29] border-white/10 text-white">
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id} className="focus:bg-white/10 focus:text-white">
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-red-400">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="text-gray-300">Hourly Rate (LKR)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("hourlyRate")}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                    errors.hourlyRate ? "border-red-500" : ""
                  }`}
                />
                {errors.hourlyRate && (
                  <p className="text-sm text-red-400">{errors.hourlyRate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability" className="text-gray-300">Availability</Label>
                <Input
                  id="availability"
                  placeholder="e.g., Mon-Fri, 9AM-5PM"
                  {...register("availability")}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                    errors.availability ? "border-red-500" : ""
                  }`}
                />
                {errors.availability && (
                  <p className="text-sm text-red-400">{errors.availability.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-300">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Tell customers about yourself..."
                {...register("bio")}
                className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                  errors.bio ? "border-red-500" : ""
                }`}
              />
              {errors.bio && (
                <p className="text-sm text-red-400">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-gray-300">Skills (comma-separated)</Label>
              <Input
                id="skills"
                placeholder="e.g., Portrait, Landscape, Digital Art"
                {...register("skills")}
                className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                  errors.skills ? "border-red-500" : ""
                }`}
              />
              {errors.skills && (
                <p className="text-sm text-red-400">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio" className="text-gray-300">Portfolio URLs (comma-separated)</Label>
              <Input
                id="portfolio"
                placeholder="e.g., https://example.com/work1, https://example.com/work2"
                {...register("portfolio")}
                className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                  errors.portfolio ? "border-red-500" : ""
                }`}
              />
              {errors.portfolio && (
                <p className="text-sm text-red-400">{errors.portfolio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-gray-300">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                {...register("website")}
                className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                  errors.website ? "border-red-500" : ""
                }`}
              />
              {errors.website && (
                <p className="text-sm text-red-400">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Social Media Links</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {(["facebook", "instagram", "twitter", "linkedin", "youtube"] as const).map((platform) => (
                  <div key={platform} className="space-y-2">
                    <Label htmlFor={platform} className="text-gray-300 capitalize">
                      {platform === "linkedin" ? "LinkedIn" : platform === "youtube" ? "YouTube" : platform}
                    </Label>
                    <Input
                      id={platform}
                      type="url"
                      placeholder={`https://${platform === "youtube" ? "youtube.com/@yourchannel" : platform === "linkedin" ? "linkedin.com/in/yourprofile" : `${platform}.com/yourprofile`}`}
                      {...register(`socialLinks.${platform}`)}
                      className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                        errors.socialLinks?.[platform] ? "border-red-500" : ""
                      }`}
                    />
                    {errors.socialLinks?.[platform] && (
                      <p className="text-sm text-red-400">{errors.socialLinks[platform]?.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Experience</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="experienceYears" className="text-gray-300">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    {...register("experience.years")}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                      errors.experience?.years ? "border-red-500" : ""
                    }`}
                  />
                  {errors.experience?.years && (
                    <p className="text-sm text-red-400">{errors.experience.years.message}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="experienceDesc" className="text-gray-300">Experience Description</Label>
                  <Textarea
                    id="experienceDesc"
                    rows={3}
                    placeholder="Describe your professional experience..."
                    {...register("experience.description")}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                      errors.experience?.description ? "border-red-500" : ""
                    }`}
                  />
                  {errors.experience?.description && (
                    <p className="text-sm text-red-400">{errors.experience.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages" className="text-gray-300">Languages (comma-separated)</Label>
              <Input
                id="languages"
                placeholder="e.g., English, Sinhala, Tamil"
                {...register("languages")}
                className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                  errors.languages ? "border-red-500" : ""
                }`}
              />
              {errors.languages && (
                <p className="text-sm text-red-400">{errors.languages.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Location</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {(["city", "state", "country", "zipCode"] as const).map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="text-gray-300">
                      {field === "zipCode" ? "Zip Code" : field === "state" ? "State/Province" : field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      {...register(`location.${field}`)}
                      className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                        errors.location?.[field] ? "border-red-500" : ""
                      }`}
                    />
                    {errors.location?.[field] && (
                      <p className="text-sm text-red-400">{errors.location[field]?.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
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

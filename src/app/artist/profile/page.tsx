"use client";

import { useState, useEffect } from "react";
import { ArtistLayout } from "@/components/layout/artist-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { artistService } from "@/lib/api/services/artistService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ArtistProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    hourlyRate: "",
    skills: "",
    availability: "",
    phone: "", // Added phone as it's often useful
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await artistService.getProfile();
      if (response.success && response.data) {
        const artist = response.data;
        setFormData({
          name: artist.name || "",
          bio: artist.bio || "",
          hourlyRate: artist.hourlyRate?.toString() || "",
          skills: artist.skills?.join(", ") || "",
          availability: artist.availability || "",
          phone: artist.phone || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Format data for API
      const dataToSubmit = {
        ...formData,
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const response = await artistService.updateProfile(dataToSubmit);

      if (response.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ArtistLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ArtistLayout>
    );
  }

  return (
    <ArtistLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your public profile information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              This information will be visible to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell customers about yourself and your experience..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="e.g., Weekends, Mon-Fri 9-5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., Oil Painting, Sketching, Portrait"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.split(",").map((skill, i) => {
                    const trimmed = skill.trim();
                    if (!trimmed) return null;
                    return (
                      <Badge key={i} variant="secondary">
                        {trimmed}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ArtistLayout>
  );
}

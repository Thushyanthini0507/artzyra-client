"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Navbar } from "@/components/navbar";
import { SimpleFooter } from "@/components/simple-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const artistSchema = z.object({
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  skills: z.string().min(1, "Skills are required"),
  hourlyRate: z.string().min(1, "Hourly rate is required"),
  availability: z.string().min(1, "Availability is required"),
});

type ArtistFormData = z.infer<typeof artistSchema>;

export default function ArtistRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
  });

  const category = watch("category");
  const availability = watch("availability");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const response = await api.get<any>("/api/categories");
        console.log("Categories response:", response);
        if (response.success && Array.isArray(response.data)) {
          console.log("Setting categories:", response.data.length);
          setCategories(response.data);
        } else if (response.success && response.data && Array.isArray(response.data.data)) {
           // Handle paginated response structure if needed, based on the curl output it was data.data
           console.log("Setting categories from data.data:", response.data.data.length);
           setCategories(response.data.data);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: ArtistFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await api.post("/api/auth/register/artist", data);

    if (response.success) {
      setSuccess("Registration successful! Please wait for admin approval.");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setError(response.error || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-2xl shadow-lg p-8 rounded-lg border bg-card text-card-foreground">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Become an Artist</h1>
            <p className="text-gray-600">
              Join our community of talented artists and showcase your work
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input id="shopName" placeholder="My Art Studio" {...register("shopName")} />
                {errors.shopName && (
                  <p className="text-sm text-red-500">{errors.shopName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+1234567890" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself and your artistic journey..."
                rows={4}
                {...register("bio")}
              />
              {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("category")}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {categories.length} categories available
                  </p>
                )}
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="50"
                  {...register("hourlyRate")}
                />
                {errors.hourlyRate && (
                  <p className="text-sm text-red-500">{errors.hourlyRate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                placeholder="Photoshop, Illustrator, Digital Painting"
                {...register("skills")}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <select
                id="availability"
                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register("availability")}
              >
                <option value="">Select availability</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="weekends">Weekends Only</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.availability && (
                <p className="text-sm text-red-500">{errors.availability.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Registering..." : "Register as Artist"}
            </Button>
          </form>
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
}

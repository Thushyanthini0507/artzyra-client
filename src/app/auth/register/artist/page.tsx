"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/public-layout";
import { useRegisterArtist } from "@/hooks/useAuthActions";
import { useCategories } from "@/hooks/useApi";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { PhoneInput } from "@/components/ui/phone-input";

import { artistRegisterSchema, type ArtistRegisterFormData } from "@/lib/validations/auth";

export default function ArtistRegisterPage() {
  const { register: registerArtist, loading, error } = useRegisterArtist();
  const { categories } = useCategories();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArtistRegisterFormData>({
    resolver: zodResolver(artistRegisterSchema),
    defaultValues: {
      phone: "+94",
    },
  });

  const onSubmit = async (data: ArtistRegisterFormData) => {
    await registerArtist(data);
  };

  return (
    <PublicLayout showFooter={false}>
      <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-[#0f0518] py-10">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/login.png')] bg-cover bg-center opacity-40 mix-blend-overlay" />
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-600/30 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-pink-600/30 blur-[120px]" />
        </div>

        <Card className="relative z-10 w-full max-w-3xl border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pt-10 pb-6">
            <CardTitle className="text-4xl font-bold tracking-tight text-white">
              Artist Registration
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Join our platform as an artist
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <div className="h-6 w-1 bg-purple-500 rounded-full" />
                  <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-medium ml-1">Full Name</Label>
                    <Input 
                      id="name" 
                      {...register("name")} 
                      className="h-12 bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl transition-all" 
                    />
                    {errors.name && <p className="text-sm text-red-300 ml-1">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium ml-1">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register("email")} 
                      className="h-12 bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl transition-all" 
                    />
                    {errors.email && <p className="text-sm text-red-300 ml-1">{errors.email.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white font-medium ml-1">Phone</Label>
                    <PhoneInput 
                      id="phone" 
                      {...register("phone")} 
                      className="h-12 bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl transition-all" 
                    />
                    {errors.phone && <p className="text-sm text-red-300 ml-1">{errors.phone.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white font-medium ml-1">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        {...register("password")} 
                        className="h-12 bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl pr-10 transition-all" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-300 ml-1">{errors.password.message}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <div className="h-6 w-1 bg-pink-500 rounded-full" />
                  <h3 className="text-lg font-semibold text-white">Professional Details</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white font-medium ml-1">Bio</Label>
                  <Textarea 
                    id="bio" 
                    {...register("bio")} 
                    className="min-h-[100px] bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl transition-all" 
                  />
                  {errors.bio && <p className="text-sm text-red-300 ml-1">{errors.bio.message}</p>}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white font-medium ml-1">Category</Label>
                    <select
                      id="category"
                      className="flex h-12 w-full rounded-xl border border-transparent bg-white/10 px-3 py-2 text-sm text-white focus:border-white/30 focus:bg-white/20 focus:outline-none transition-all"
                      {...register("category")}
                    >
                      <option value="" className="text-black">Select a category</option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id} className="text-black">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-sm text-red-300 ml-1">{errors.category.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate" className="text-white font-medium ml-1">Hourly Rate (LKR)</Label>
                    <Input 
                      id="hourlyRate" 
                      type="number" 
                      {...register("hourlyRate")} 
                      className="h-12 bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl transition-all" 
                    />
                    {errors.hourlyRate && <p className="text-sm text-red-300 ml-1">{errors.hourlyRate.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-white font-medium ml-1">Skills (comma separated)</Label>
                  <Input 
                    id="skills" 
                    placeholder="e.g. Painting, Sketching, Digital Art" 
                    {...register("skills")} 
                    className="h-12 bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl transition-all" 
                  />
                  {errors.skills && <p className="text-sm text-red-300 ml-1">{errors.skills.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-white font-medium ml-1">Availability</Label>
                  <select
                    id="availability"
                    className="flex h-12 w-full rounded-xl border border-transparent bg-white/10 px-3 py-2 text-sm text-white focus:border-white/30 focus:bg-white/20 focus:outline-none transition-all"
                    {...register("availability")}
                  >
                    <option value="" className="text-black">Select availability</option>
                    <option value="Full-time" className="text-black">Full-time</option>
                    <option value="Part-time" className="text-black">Part-time</option>
                    <option value="Weekends" className="text-black">Weekends</option>
                  </select>
                  {errors.availability && <p className="text-sm text-red-300 ml-1">{errors.availability.message}</p>}
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold bg-[#3b0764] hover:bg-[#581c87] text-white rounded-xl shadow-lg shadow-purple-900/20 transition-all duration-300 mt-4" 
                disabled={loading}
              >
                {loading ? "Submitting Application..." : "Register as Artist"}
              </Button>
              
              <p className="text-center text-sm text-gray-300 mt-4">
                Already have an account? <Link href="/auth/login" className="font-bold text-white hover:underline">Sign in</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}

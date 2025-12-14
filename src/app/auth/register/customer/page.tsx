"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/public-layout";
import { useRegisterCustomer } from "@/hooks/useAuthActions";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState, Suspense } from "react";
import { PhoneInput } from "@/components/ui/phone-input";

import { customerRegisterSchema, type CustomerRegisterFormData } from "@/lib/validations/auth";

function CustomerRegisterForm() {
  const { register: registerCustomer, loading, error } = useRegisterCustomer();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerRegisterFormData>({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      phone: "+94",
    },
  });

  const onSubmit = async (data: CustomerRegisterFormData) => {
    await registerCustomer(data);
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

        <Card className="relative z-10 w-full max-w-2xl border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pt-10 pb-6">
            <CardTitle className="text-4xl font-bold tracking-tight text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Join Artzyra to discover and hire amazing artists
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
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
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-sm text-red-300 ml-1">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium ml-1">Email</Label>
                    <Input 
                      id="email" 
                      type="text" 
                      {...register("email")} 
                      className="h-12 bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl transition-all" 
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-sm text-red-300 ml-1">{errors.email.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white font-medium ml-1">Mobile Number</Label>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <PhoneInput 
                          id="phone" 
                          {...field} 
                          className="h-12 bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl transition-all" 
                        />
                      )}
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
                        placeholder="••••••"
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
                {loading ? "Creating Account..." : "Create Account"}
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

export default function CustomerRegisterPage() {
  return (
    <Suspense fallback={
      <PublicLayout showFooter={false}>
        <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-[#0f0518]">
          <div className="text-white">Loading...</div>
        </div>
      </PublicLayout>
    }>
      <CustomerRegisterForm />
    </Suspense>
  );
}

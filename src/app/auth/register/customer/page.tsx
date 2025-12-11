"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/public-layout";
import { useRegisterCustomer } from "@/hooks/useAuthActions";
import Link from "next/link";

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\+94\d{9}$/, "Phone number must start with +94 and have 9 digits after"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerRegisterPage() {
  const { register: registerCustomer, loading, error } = useRegisterCustomer();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      phone: "+94",
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    await registerCustomer(data);
  };

  return (
    <PublicLayout>
      <div className="relative min-h-[calc(100vh-80px)] py-10 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-2xl mx-auto border-white/10 bg-[#2d1b4e] backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="text-3xl font-bold tracking-tight text-white">Create Account</CardTitle>
              <CardDescription className="text-gray-300 text-base">
                Join Artzyra to discover and hire amazing artists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <Input id="name" {...register("name")} className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-400" />
                      {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input id="email" type="email" {...register("email")} className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-400" />
                      {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Phone</Label>
                      <Input id="phone" type="tel" {...register("phone")} className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-400" />
                      {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <Input id="password" type="password" {...register("password")} className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-400" />
                      {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm text-center border border-red-500/20">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-white" 
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
                
                <p className="text-center text-sm text-gray-400">
                  Already have an account? <Link href="/auth/login" className="text-primary hover:underline font-medium hover:text-primary/80">Sign in</Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

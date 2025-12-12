"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/useAuthActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/public-layout";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login, loading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <PublicLayout showFooter={false}>
      <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-[#0f0518]">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/login.png')] bg-cover bg-center opacity-40 mix-blend-overlay" />
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-600/30 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-pink-600/30 blur-[120px]" />
        </div>

        <Card className="relative z-10 w-full max-w-[500px] border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pt-10 pb-6">
            <CardTitle className="text-4xl font-bold tracking-tight text-white">
              Welcome To Artzyra
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Welcome! Please Enter Your Details
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium ml-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white/10 border-transparent focus:border-white/30 focus:bg-white/20 text-white placeholder:text-white/40 rounded-xl transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-white font-medium ml-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                <div className="flex justify-start">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Forget password
                  </Link>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold bg-[#3b0764] hover:bg-[#581c87] text-white rounded-xl shadow-lg shadow-purple-900/20 transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white/10 border-transparent hover:bg-white/20 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <Link
                  href="/auth/register/customer"
                  className="font-bold text-white hover:underline"
                >
                  Sign up for free
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PublicLayout>
  );
}

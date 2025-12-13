"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/useAuthActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicLayout } from "@/components/layout/public-layout";
import { Eye, EyeOff, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function LoginForm() {
  const { login, loading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const registered = searchParams.get("registered");

  useEffect(() => {
    if (registered) {
      toast.success("Registration successful! Please log in.");
    }
  }, [registered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result.success) {
      if (redirect) {
        router.push(decodeURIComponent(redirect));
      }
    }
  };

  const registerUrl = redirect 
    ? `/auth/register/customer?redirect=${encodeURIComponent(redirect)}`
    : "/auth/register/customer";

  return (
    <PublicLayout showFooter={false}>
      <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-gray-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/login.png')] bg-cover bg-center opacity-50" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Artzyra Login Form</h1>
          </div>

          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Header with Curve */}
            <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: "url('/images/login.png')" }}>
              <div className="absolute inset-0 bg-black/30" />
              
              {/* Curved Bottom */}
              {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
                </svg>
              </div> */}

              {/* Avatar */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
                   <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <User className="w-10 h-10 text-gray-400" />
                   </div>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pb-8">
                 <h2 className="text-2xl font-bold text-white drop-shadow-md">Welcome Back</h2>
              </div>
            </div>

            <div className="pt-16 pb-8 px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder:text-gray-400 rounded-md transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder:text-gray-400 rounded-md pr-10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-md shadow-lg transition-all duration-300 uppercase tracking-wide"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Not a member yet?{" "}
                    <Link
                      href={registerUrl}
                      className="font-bold text-[#d97706] hover:text-[#b45309] transition-colors"
                    >
                      Join Now!
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
          
           <div className="text-center mt-8 text-xs text-gray-400">
              <p>© 2025 Artzyra Login Form. All rights reserved.</p>
           </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <PublicLayout showFooter={false}>
        <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-gray-900">
          <div className="text-white">Loading...</div>
        </div>
      </PublicLayout>
    }>
      <LoginForm />
    </Suspense>
  );
}

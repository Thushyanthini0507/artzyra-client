"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/useAuthActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/public-layout";

export default function LoginPage() {
  const { login, loading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <PublicLayout>
      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] py-10 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px]" />
        </div>

        <Card className="w-full max-w-md z-10 border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-xs text-primary hover:text-primary/80 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                />
              </div>
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pt-2">
              <Button 
                type="submit" 
                className="w-full py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="relative w-full text-center text-sm">
                <span className="bg-background px-2 text-muted-foreground relative z-10">
                  New to Artzyra?
                </span>
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
                  <Link href="/auth/register/customer">Join as Customer</Link>
                </Button>
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
                  <Link href="/auth/register/artist">Join as Artist</Link>
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PublicLayout>
  );
}

"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { HomeCategories } from "@/components/HomeCategories";
import Image from "next/image";
import {
  Search,
  User,
  Calendar,
  MessageCircle,
  Star,
  Briefcase,
  Bell,
  Lock,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Search,
      title: "Skill-Based Discovery",
      description: "Find artists by their specific skills and expertise",
    },
    {
      icon: User,
      title: "Profile Showcase",
      description: "Comprehensive artist profiles with portfolios",
    },
    {
      icon: Calendar,
      title: "Quick & Easy Booking",
      description: "Book artists instantly with our streamlined process",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Chat directly with artists about your project",
    },
    {
      icon: Star,
      title: "Real Opinions",
      description: "Read authentic reviews from previous clients",
    },
    {
      icon: Briefcase,
      title: "Portfolio Display",
      description: "Browse artist portfolios and previous work",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description: "Stay updated with instant notifications",
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description: "Safe and secure transactions and interactions",
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Help artists grow their creative business",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      username: "@sarahj",
      rating: 5,
      text: "Artzyra helped me find the perfect photographer for my wedding. The platform is easy to use and the artists are incredibly talented!",
    },
    {
      name: "Michael Chen",
      username: "@michaelc",
      rating: 5,
      text: "As an artist, Artzyra has given me the opportunity to connect with amazing clients and grow my business. Highly recommended!",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden text-white">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm backdrop-blur-sm border border-white/20">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Available for hire
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                DISCOVER A WORLD FULL OF CREATIVITY, TALENT, AND LIMITLESS POSSIBILITIES.
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                Artzyra is a modern digital platform built to connect people with unique creative skills from various fields — all to enrich your creative business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/browse">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 text-lg h-14 font-semibold">
                    Explore talents
                  </Button>
                </Link>
                <Link href="/auth/register/artist">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 text-lg h-14">
                    Join as Talent
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              {/* Laptop Mockup Representation */}
              <div className="relative mx-auto w-full max-w-[600px]">
                <div className="relative rounded-t-xl bg-gray-900 p-2 shadow-2xl ring-1 ring-gray-900/10">
                  <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-800 relative">
                     {/* Screen Content */}
                     <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                        <div className="text-center">
                          <h3 className="text-4xl font-bold text-white mb-2">Artzyra</h3>
                          <p className="text-gray-400">Connecting Creativity</p>
                        </div>
                     </div>
                  </div>
                </div>
                <div className="relative mx-auto h-4 w-full max-w-[700px] rounded-b-xl bg-gray-800 ring-1 ring-gray-900/10"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/30 rounded-full blur-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* What we can offer Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">What we can offer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              At Artzyra, we provide everything a skilled person and a customer needs to connect effectively and professionally.
            </p>
          </div>
          
          <div className="flex flex-col gap-16 max-w-[1400px] mx-auto">
            {/* First Row - 5 items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {features.slice(0, 5).map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 mb-6 rounded-full bg-[#b39ddb] flex items-center justify-center group-hover:bg-[#b39ddb]/80 transition-colors duration-300">
                      <Icon className="h-10 w-10 text-[#3e1d56]" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Second Row - 4 items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:w-[80%] mx-auto">
              {features.slice(5, 9).map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index + 5} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 mb-6 rounded-full bg-[#b39ddb] flex items-center justify-center group-hover:bg-[#b39ddb]/80 transition-colors duration-300">
                      <Icon className="h-10 w-10 text-[#3e1d56]" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <h3 className="text-primary font-semibold tracking-wide uppercase">Testimonials</h3>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Artzyra&apos;s<br/>Happy Customer</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Artzyra, we provide everything a skilled person and a customer needs to connect effectively and professionally.
              </p>
              <Link href="/reviews">
                <Button variant="outline" className="rounded-full px-8 border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors">
                  Show all previous customers
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              {/* Decorative background for cards */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl -z-10 blur-xl"></div>
              
              <div className="grid gap-6 relative">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-start w-full">
                            <div>
                                <h4 className="font-bold text-lg">{testimonial.name}</h4>
                                <p className="text-sm text-muted-foreground">{testimonial.username}</p>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed pt-2">
                            &quot;{testimonial.text}&quot;
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Our Skills Categories</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <HomeCategories />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl p-12 md:p-20 shadow-xl text-center max-w-5xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Ready to Share Your Talent?</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join our vibrant community of artists. Reach new clients, manage your bookings seamlessly, and grow your creative business with Artzyra.
              </p>
              <Link href="/auth/register/artist">
                <Button size="lg" className="rounded-full px-10 py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-300">
                  JOIN AS ARTIST
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

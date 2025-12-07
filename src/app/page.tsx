"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Facebook,
  Twitter,
  Instagram,
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
    {
      name: "Emily Rodriguez",
      username: "@emilyr",
      rating: 5,
      text: "The booking process was seamless and the artist exceeded my expectations. Will definitely use Artzyra again!",
    },
    {
      name: "David Thompson",
      username: "@davidt",
      rating: 5,
      text: "Great platform for finding creative talent. The reviews and portfolios make it easy to choose the right artist.",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-muted overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                DISCOVER A WORLD FULL OF CREATIVITY, TALENT, AND LIMITLESS POSSIBILITIES.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                A modern digital platform built to connect people with unique creative skills from various fields - all to enrich your creative business with Artzyra.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/browse">
                  <Button size="lg">
                    Explore talents
                  </Button>
                </Link>
                <Link href="/auth/register/artist">
                  <Button size="lg" variant="outline">
                    Join as Talent
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] hidden lg:block">
              <div className="absolute inset-0 bg-muted border rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-4xl font-bold mb-4">Artzyra</div>
                  <div className="text-muted-foreground">Your Creative Platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we can offer Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What we can offer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artzyra helps skilled individuals and customers connect effectively, creating opportunities for creative collaboration and business growth.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Icon className="h-10 w-10 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Artzyra&apos;s Happy Customer</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of satisfied customers and artists who have found success on our platform. Read what they have to say about their experience with Artzyra.
              </p>
              <Button variant="outline">
                Show all previous customers
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-4">
                  <CardContent className="p-0 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Oru Skills Categories</h2>
          <HomeCategories />
        </div>
      </section>

      {/* Ready to Share Your Talent Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Share Your Talent?</h2>
            <p className="text-lg text-muted-foreground">
              Join our community of talented artists and start connecting with clients who need your creative skills. Build your portfolio, set your rates, and grow your creative business.
            </p>
            <Link href="/auth/register/artist">
              <Button size="lg">
                JOIN AS ARTIST
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

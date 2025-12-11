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
      {/* Hero Section */}
      <div className=" bg-[url('/images/hero-bg.png')] bg-top bg-no-repeat">
        <section className="relative min-h-screen flex items-center ">
          <div className="container mx-auto px-4 relative z-10 pt-20">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
                DISCOVER A WORLD
                <br />
                FULL OF CREATIVITY,
                <br />
                TALENT, AND
                <br />
                LIMITLESS POSSIBILITIES.
              </h1>
              <p className="text-lg md:text-xl text-white max-w-xl leading-relaxed mb-12">
                Artzyra is a modern digital platform built to connect people
                with skilled creators from various fields — all in one place
              </p>

              {/* Dashed Border Container */}
              <div className="relative inline-block p-1">
                <div className="absolute inset-0 rounded-xl"></div>
                <div className="relative flex flex-col sm:flex-row gap-6 p-6">
                  <Link href="/browse">
                    <Button
                      size="lg"
                      className="bg-[#b39ddb] text-[#2d1b4e] hover:bg-[#b39ddb]/90 rounded-full px-8 text-lg h-12 font-semibold min-w-[180px]"
                    >
                      Explore Talents
                    </Button>
                  </Link>
                  <Link href="/auth/register/artist">
                    <Button
                      size="lg"
                      className="bg-white text-[#2d1b4e] hover:bg-white/90 rounded-full px-8 text-lg h-12 font-semibold min-w-[180px]"
                    >
                      Join as Talent
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What we can offer Section */}
        <section className="py-24 relative bg-transparent">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl p-8 md:p-12 relative">
              <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
                  What we can offer
                </h2>
                <p className="text-lg text-[#5e2677] max-w-2xl mx-auto">
                  At Artzyra, we provide everything a skilled person and a
                  customer needs to connect effectively and professionally.
                </p>
              </div>

              <div className="flex flex-col gap-16 max-w-[1400px] mx-auto">
                {/* First Row - 5 items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                  {features.slice(0, 5).map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center text-center group text-black"
                      >
                        <div className="w-20 h-20 mb-6 rounded-full bg-[#b39ddb] flex items-center justify-center group-hover:bg-[#b39ddb]/80 transition-colors duration-300">
                          <Icon
                            className="h-10 w-10 text-[#3e1d56]"
                            strokeWidth={1.5}
                          />
                        </div>
                        <h3 className="font-bold text-lg mb-3  text-black">
                          {feature.title}
                        </h3>
                        <p className="text-sm  text-black/80 leading-relaxed max-w-[200px]">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Second Row - 4 items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:w-[80%] mx-auto">
                  {features.slice(5, 9).map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index + 5}
                        className="flex flex-col items-center text-center group  text-black"
                      >
                        <div className="w-20 h-20 mb-6 rounded-full bg-[#b39ddb] flex items-center justify-center group-hover:bg-[#b39ddb]/80 transition-colors duration-300">
                          <Icon
                            className="h-10 w-10 text-[#3e1d56]"
                            strokeWidth={1.5}
                          />
                        </div>
                        <h3 className="font-bold text-lg mb-3 text-black">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-black/80 leading-relaxed max-w-[200px]">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl font-bold text-[#3e1d56]">
                    Artzyra&apos;s
                  </h2>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#3e1d56]">
                    Happy Customer
                  </h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  At Artzyra, we provide everything a skilled person and a
                  customer needs to connect effectively and professionally.
                </p>
                <Link href="/reviews">
                  <Button className="rounded-full px-8 py-6 bg-[#3e1d56] text-white hover:bg-[#3e1d56]/90 transition-colors text-lg">
                    Show All Review from Customers
                  </Button>
                </Link>
              </div>

              <div className="relative">
                {/* Decorative background for cards */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl -z-10 blur-xl"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                  {/* Column 1 */}
                  <div className="space-y-6 mt-12">
                    {[
                      {
                        name: "Sarah Johnson",
                        service: "Wedding Photography",
                        text: "Artzyra made finding a photographer so easy! The quality of work was outstanding and the booking process was seamless.",
                        image: "https://i.pravatar.cc/150?img=5",
                      },
                      {
                        name: "David Chen",
                        service: "Digital Illustration",
                        text: "I needed a custom logo for my startup and found the perfect artist within minutes. Highly recommended for any business owner!",
                        image: "https://i.pravatar.cc/150?img=11",
                      },
                    ].map((testimonial, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow-sm relative border border-gray-100"
                      >
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#3e1d56] rounded-full flex items-center justify-center text-white">
                          <span className="text-xl leading-none">&quot;</span>
                        </div>
                        <div className="flex gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full border-2 border-[#3e1d56] flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-[#9b87f5]">
                              {testimonial.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {testimonial.service}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {testimonial.text}
                        </p>
                        <div className="flex justify-end gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-6">
                    {[
                      {
                        name: "Emily Davis",
                        service: "Music Production",
                        text: "Connected with a talented producer who helped bring my song to life. The communication tools on Artzyra are fantastic.",
                        image: "https://i.pravatar.cc/150?img=9",
                      },
                      {
                        name: "James Wilson",
                        service: "Portrait Painting",
                        text: "Commissioned a family portrait and the result exceeded my expectations. A truly professional platform for artists.",
                        image: "https://i.pravatar.cc/150?img=3",
                      },
                    ].map((testimonial, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow-sm relative border border-gray-100"
                      >
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#3e1d56] rounded-full flex items-center justify-center text-white">
                          <span className="text-xl leading-none">&quot;</span>
                        </div>
                        <div className="flex gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full border-2 border-[#3e1d56] flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-[#9b87f5]">
                              {testimonial.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {testimonial.service}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {testimonial.text}
                        </p>
                        <div className="flex justify-end gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                Our Skills Categories
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <HomeCategories />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-6xl mx-auto">
              <div className="text-left max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Share Your Talent?
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Join our vibrant community of artists. Reach new clients,
                  manage your bookings seamlessly, and grow your creative
                  business with Artzyra.
                </p>
              </div>

              <Link href="/auth/register/artist">
                <Button
                  size="lg"
                  className="rounded-full px-10 py-6 text-lg bg-[#2d1b4e] text-white hover:bg-[#2d1b4e]/90 shadow-lg transition-all duration-300"
                >
                  Join as an Artist
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

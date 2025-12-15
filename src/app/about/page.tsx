"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  Palette, 
  MessageCircle, 
  Calendar, 
  Shield, 
  Search,
  Eye,
  Heart,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Award,
  Zap,
  Globe,
  ArrowRight,
  Star,
  Briefcase,
  Target,
  Rocket
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Artists", value: "500+", icon: Palette, color: "from-purple-500 to-pink-500" },
    { label: "Happy Customers", value: "2K+", icon: Heart, color: "from-pink-500 to-rose-500" },
    { label: "Projects Completed", value: "5K+", icon: Briefcase, color: "from-blue-500 to-cyan-500" },
    { label: "Success Rate", value: "98%", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  ];

  const artistFeatures = [
    {
      icon: Palette,
      title: "A dedicated profile to display your work, skills, and style",
      description: "Showcase your portfolio, skills, and artistic style in a professional profile that attracts clients",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Eye,
      title: "A clean portfolio layout to attract potential clients",
      description: "Beautiful, organized portfolio display that makes your work stand out",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageCircle,
      title: "A built-in chat system so customers can contact you directly",
      description: "Communicate seamlessly with clients through our integrated messaging platform",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Calendar,
      title: "A booking system that helps you get more projects",
      description: "Streamlined booking process that makes it easy for clients to hire you",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Sparkles,
      title: "A reliable platform to build your brand and grow your income",
      description: "Build your reputation, expand your reach, and grow your creative business",
      color: "from-violet-500 to-purple-500",
    },
  ];

  const customerFeatures = [
    {
      icon: Search,
      title: "Find talented artists and designers in one place",
      description: "Browse through hundreds of verified artists with diverse skills and styles",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Eye,
      title: "View detailed artist profiles and portfolios",
      description: "Explore comprehensive profiles with portfolios, reviews, and ratings",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: MessageCircle,
      title: "Chat directly before making a booking",
      description: "Discuss your project requirements directly with artists before booking",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: Shield,
      title: "Safe, simple, and transparent experience",
      description: "Secure platform with transparent pricing and clear communication",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Heart,
      title: "Discover the perfect creator for your ideas",
      description: "Find the ideal artist who matches your vision and project needs",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const whyArtzyra = [
    { 
      text: "Easy to use", 
      description: "Intuitive interface for everyone",
      color: "from-purple-500 to-violet-500",
      icon: Zap
    },
    { 
      text: "Professional and clean design", 
      description: "Modern, polished experience",
      color: "from-blue-500 to-indigo-500",
      icon: Award
    },
    { 
      text: "Focus on real talent", 
      description: "Verified artists only",
      color: "from-green-500 to-emerald-500",
      icon: Star
    },
    { 
      text: "Built for both established artists and beginners", 
      description: "Inclusive platform for all",
      color: "from-orange-500 to-amber-500",
      icon: Target
    },
    { 
      text: "A supportive place for creativity to grow", 
      description: "Nurturing creative community",
      color: "from-pink-500 to-rose-500",
      icon: Rocket
    },
  ];

  const values = [
    {
      title: "Innovation",
      description: "We continuously evolve to meet the needs of our creative community",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Trust",
      description: "Building a safe and reliable platform for artists and customers",
      icon: Shield,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Community",
      description: "Fostering connections and supporting creative growth",
      icon: Users,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Excellence",
      description: "Committed to delivering the best experience for everyone",
      icon: Award,
      color: "from-orange-500 to-amber-500"
    },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#0f0d1a]">
        {/* Hero Section - Enhanced */}
        <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-b from-[#0f0d1a] via-[#1a1625] to-[#0f0d1a]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-violet-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 backdrop-blur-sm mb-4 shadow-lg shadow-purple-500/20">
                <Sparkles className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium text-purple-200">Welcome to Artzyra</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                  About Artzyra
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                A modern creative marketplace designed to bring artists and customers together on one seamless platform. 
                We built Artzyra with a simple vision — to give every artist the opportunity to showcase their talent 
                and every customer the chance to discover the right creator for their needs.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/30">
                  <Link href="/browse">
                    Browse Artists
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-purple-500/60 text-purple-200 hover:bg-purple-500/20 bg-purple-500/5">
                  <Link href="/auth/register">
                    Join as Artist
                    <Rocket className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 -mt-16 relative z-20 bg-[#0f0d1a]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="border-2 border-purple-500/20 bg-gradient-to-br from-[#1e1b29] to-[#15121f] backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-300 font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Purpose Section - Enhanced */}
        <section className="py-20 relative bg-[#15121f]">
          <div className="container mx-auto px-4">
            <Card className="border-2 border-purple-500/40 bg-gradient-to-br from-[#1e1b29] via-[#251f35] to-[#1e1b29] backdrop-blur-sm hover:border-purple-500/60 transition-all duration-300 shadow-2xl shadow-purple-500/20">
              <CardContent className="p-8 md:p-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Our Purpose
                  </h2>
                </div>
                <div className="space-y-6 text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl">
                  <p>
                    Artzyra was created to support artists, designers, and creators who want to expand their reach beyond social media. 
                    Many talented individuals struggle to get visibility or find the right clients — that&apos;s where we come in.
                  </p>
                  <p>
                    Artzyra provides a professional space where creativity is celebrated, connections are made, and work opportunities grow. 
                    We believe every artist deserves a platform to showcase their talent and every customer deserves access to quality creative work.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Offer Section - Enhanced */}
        <section className="py-20 bg-gradient-to-b from-[#15121f] via-[#1a1625] to-[#15121f]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  What We Offer
                </span>
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Artzyra gives both artists and customers a smooth and professional experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* For Artists */}
              <Card className="border-2 border-purple-500/40 bg-gradient-to-br from-[#1e1b29] to-[#251f35] backdrop-blur-sm hover:border-purple-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 group">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <Palette className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      For Artists
                    </h3>
                  </div>
                  <ul className="space-y-6">
                    {artistFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <li key={index} className="flex items-start gap-4 group/item">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-100 mb-1 group-hover/item:text-purple-300 transition-colors">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {feature.description}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>

              {/* For Customers */}
              <Card className="border-2 border-blue-500/40 bg-gradient-to-br from-[#1a1f2e] to-[#1f2535] backdrop-blur-sm hover:border-blue-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 group">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      For Customers
                    </h3>
                  </div>
                  <ul className="space-y-6">
                    {customerFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <li key={index} className="flex items-start gap-4 group/item">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-100 mb-1 group-hover/item:text-blue-300 transition-colors">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {feature.description}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Vision Section - Enhanced */}
        <section className="py-20 bg-[#15121f]">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-[#1e1b29] via-[#251f35] to-[#1e1b29] border-2 border-violet-500/40 hover:border-violet-500/60 transition-all duration-300 shadow-2xl shadow-violet-500/20">
              <CardContent className="p-8 md:p-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/50">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                    Our Vision
                  </h2>
                </div>
                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-4xl">
                  We want to make Artzyra the go-to platform for creative talent. Whether you&apos;re looking for a graphic designer, 
                  video editor, illustrator, photographer, or any type of artist — Artzyra connects you to the right person instantly. 
                  Our vision is to create a global community where creativity knows no bounds.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-gradient-to-b from-[#15121f] via-[#1a1625] to-[#15121f]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                  Our Core Values
                </span>
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="border-2 border-purple-500/20 bg-gradient-to-br from-[#1e1b29] to-[#15121f] backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 group">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-100 mb-2">{value.title}</h3>
                      <p className="text-sm text-gray-400">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Artzyra Section - Enhanced */}
        <section className="py-20 bg-[#15121f]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Why Artzyra?
                </span>
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Discover what makes us the perfect platform for your creative journey
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {whyArtzyra.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="border-2 border-purple-500/20 bg-gradient-to-br from-[#1e1b29] to-[#15121f] backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-100 mb-2 group-hover:text-purple-300 transition-colors">
                        {item.text}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing Statement - Enhanced */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#15121f] via-[#1a1625] to-[#0f0d1a]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-violet-900/30" />
          <div className="container mx-auto px-4 relative z-10">
            <Card className="border-2 border-purple-500/40 bg-gradient-to-br from-[#1e1b29] via-[#251f35] to-[#1e1b29] backdrop-blur-sm hover:border-purple-500/60 transition-all duration-300 shadow-2xl shadow-purple-500/30">
              <CardContent className="p-12 md:p-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-violet-600/10 blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40 mb-4 shadow-lg shadow-purple-500/30">
                    <Heart className="h-8 w-8 text-pink-300" />
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                      Artzyra is more than a platform — it&apos;s a community.
                    </span>
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                    A space where artists shine, customers find quality work, and creativity gets the recognition it deserves. 
                    Join us in building the future of creative collaboration.
                  </p>
                  <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
                    <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/30">
                      <Link href="/browse">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-purple-500/60 text-purple-200 hover:bg-purple-500/20 bg-purple-500/5">
                      <Link href="/contact">
                        Contact Us
                        <MessageCircle className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

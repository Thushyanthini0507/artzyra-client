"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";
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
  CheckCircle
} from "lucide-react";

export default function AboutPage() {
  const artistFeatures = [
    {
      icon: Palette,
      title: "A dedicated profile to display your work, skills, and style",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Eye,
      title: "A clean portfolio layout to attract potential clients",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageCircle,
      title: "A built-in chat system so customers can contact you directly",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Calendar,
      title: "A booking system that helps you get more projects",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Sparkles,
      title: "A reliable platform to build your brand and grow your income",
      color: "from-violet-500 to-purple-500",
    },
  ];

  const customerFeatures = [
    {
      icon: Search,
      title: "Find talented artists and designers in one place",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Eye,
      title: "View detailed artist profiles and portfolios",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: MessageCircle,
      title: "Chat directly before making a booking",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: Shield,
      title: "Safe, simple, and transparent experience",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Heart,
      title: "Discover the perfect creator for your ideas",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const whyArtzyra = [
    { text: "Easy to use", color: "from-purple-500 to-violet-500" },
    { text: "Professional and clean design", color: "from-blue-500 to-indigo-500" },
    { text: "Focus on real talent", color: "from-green-500 to-emerald-500" },
    { text: "Built for both established artists and beginners", color: "from-orange-500 to-amber-500" },
    { text: "A supportive place for creativity to grow", color: "from-pink-500 to-rose-500" },
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-violet-500/10 blur-3xl -z-10" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
            About Artzyra
          </h1>
          <div className="max-w-3xl mx-auto space-y-4 text-lg text-muted-foreground">
            <p>
              Artzyra is a modern creative marketplace designed to bring artists and customers together on one seamless platform. We built Artzyra with a simple vision — to give every artist the opportunity to showcase their talent and every customer the chance to discover the right creator for their needs.
            </p>
          </div>
        </div>

        {/* Our Purpose Section */}
        <section className="mb-16">
          <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Our Purpose</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Artzyra was created to support artists, designers, and creators who want to expand their reach beyond social media. Many talented individuals struggle to get visibility or find the right clients — that&apos;s where we come in.
                </p>
                <p>
                  Artzyra provides a professional space where creativity is celebrated, connections are made, and work opportunities grow.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* What We Offer Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">What We Offer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artzyra gives both artists and customers a smooth and professional experience:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Artists */}
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-violet-500/5 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">For Artists</h3>
                </div>
                <ul className="space-y-4">
                  {artistFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} flex-shrink-0`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            {/* For Customers */}
            <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">For Customers</h3>
                </div>
                <ul className="space-y-4">
                  {customerFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} flex-shrink-0`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 border-2 border-violet-500/20 hover:border-violet-500/40 transition-all duration-300">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                We want to make Artzyra the go-to platform for creative talent. Whether you&apos;re looking for a graphic designer, video editor, illustrator, photographer, or any type of artist — Artzyra connects you to the right person instantly.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why Artzyra Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Why Artzyra?</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {whyArtzyra.map((item, index) => (
              <Card key={index} className="border-2 border-white/10 hover:border-white/30 transition-all duration-300 group hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium group-hover:text-foreground transition-colors">{item.text}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Closing Statement */}
        <section>
          <Card className="border-2 border-gradient-to-r from-purple-500/20 via-pink-500/20 to-violet-500/20 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-violet-500/5 hover:border-purple-500/40 transition-all duration-300">
            <CardContent className="p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-violet-500/5 blur-2xl" />
              <p className="text-xl md:text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent relative z-10">
                Artzyra is more than a platform — it&apos;s a community.
              </p>
              <p className="text-lg text-muted-foreground relative z-10">
                A space where artists shine, customers find quality work, and creativity gets the recognition it deserves.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </PublicLayout>
  );
}






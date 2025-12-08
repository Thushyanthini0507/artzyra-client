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
    },
    {
      icon: Eye,
      title: "A clean portfolio layout to attract potential clients",
    },
    {
      icon: MessageCircle,
      title: "A built-in chat system so customers can contact you directly",
    },
    {
      icon: Calendar,
      title: "A booking system that helps you get more projects",
    },
    {
      icon: Sparkles,
      title: "A reliable platform to build your brand and grow your income",
    },
  ];

  const customerFeatures = [
    {
      icon: Search,
      title: "Find talented artists and designers in one place",
    },
    {
      icon: Eye,
      title: "View detailed artist profiles and portfolios",
    },
    {
      icon: MessageCircle,
      title: "Chat directly before making a booking",
    },
    {
      icon: Shield,
      title: "Safe, simple, and transparent experience",
    },
    {
      icon: Heart,
      title: "Discover the perfect creator for your ideas",
    },
  ];

  const whyArtzyra = [
    "Easy to use",
    "Professional and clean design",
    "Focus on real talent",
    "Built for both established artists and beginners",
    "A supportive place for creativity to grow",
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
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
          <Card className="border-2">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Purpose</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artzyra gives both artists and customers a smooth and professional experience:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Artists */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Palette className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">For Artists</h3>
                </div>
                <ul className="space-y-4">
                  {artistFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            {/* For Customers */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">For Customers</h3>
                </div>
                <ul className="space-y-4">
                  {customerFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature.title}</span>
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
          <Card className="bg-muted">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                We want to make Artzyra the go-to platform for creative talent. Whether you&apos;re looking for a graphic designer, video editor, illustrator, photographer, or any type of artist — Artzyra connects you to the right person instantly.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why Artzyra Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Artzyra?</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {whyArtzyra.map((item, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Closing Statement */}
        <section>
          <Card className="border-2 bg-muted">
            <CardContent className="p-8 md:p-12 text-center">
              <p className="text-xl md:text-2xl font-semibold mb-4">
                Artzyra is more than a platform — it&apos;s a community.
              </p>
              <p className="text-lg text-muted-foreground">
                A space where artists shine, customers find quality work, and creativity gets the recognition it deserves.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </PublicLayout>
  );
}


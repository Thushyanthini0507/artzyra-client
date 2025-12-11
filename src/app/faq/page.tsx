"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is Artzyra?",
          a: "Artzyra is a platform that connects talented artists with customers looking for creative services. We make it easy to find, book, and pay for artistic work."
        },
        {
          q: "Is Artzyra free to use?",
          a: "Signing up and browsing artists is completely free. We charge a small service fee on completed bookings to maintain the platform."
        }
      ]
    },
    {
      category: "For Customers",
      questions: [
        {
          q: "How do I book an artist?",
          a: "Simply browse our artists, select one that fits your needs, and click 'Book Now'. You can choose a service, date, and time, and send a request directly to the artist."
        },
        {
          q: "Is my payment secure?",
          a: "Yes, all payments are processed securely. We hold the payment until the service is completed to ensure your satisfaction."
        },
        {
          q: "Can I cancel a booking?",
          a: "Yes, you can cancel a booking based on the artist's cancellation policy. Generally, cancellations made 24 hours before the appointment are fully refundable."
        }
      ]
    },
    {
      category: "For Artists",
      questions: [
        {
          q: "How do I become an artist on Artzyra?",
          a: "Click on 'Join as Artist' and fill out your profile. Once your application is reviewed and approved, you can start accepting bookings."
        },
        {
          q: "When do I get paid?",
          a: "Payments are released to your account 24-48 hours after a booking is successfully completed."
        },
        {
          q: "Can I set my own prices?",
          a: "Absolutely! You have full control over your services, pricing, and availability."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about using Artzyra.
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search questions..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          ) : (
            filteredFaqs.map((category, idx) => (
              <div key={idx} className="space-y-6">
                <h2 className="text-2xl font-bold pl-2 border-l-4 border-primary">{category.category}</h2>
                <div className="grid gap-4">
                  {category.questions.map((item, qIdx) => (
                    <Card key={qIdx} className="hover:bg-accent/5 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">{item.q}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.a}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

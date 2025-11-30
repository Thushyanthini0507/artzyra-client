"use client";

import { useState } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { CategorySelector } from "@/components/customer/CategorySelector";
import { ArtistSelector } from "@/components/customer/ArtistSelector";
import { BookingFormStep } from "@/components/customer/BookingFormStep";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateBookingPage() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep(2);
  };

  const handleArtistSelect = (artistId: string) => {
    setSelectedArtist(artistId);
    setStep(3);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedArtist(null);
    setStep(1);
  };

  const handleBackToArtists = () => {
    setSelectedArtist(null);
    setStep(2);
  };

  return (
    <CustomerLayout>
      <div className="max-w-5xl mx-auto py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Book an Artist</h1>
          <p className="text-muted-foreground">Follow the steps to create your booking</p>
        </div>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  1
                </div>
                <span className={step >= 1 ? 'font-medium' : 'text-muted-foreground'}>Category</span>
              </div>
              <div className="h-px flex-1 bg-border mx-4" />
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  2
                </div>
                <span className={step >= 2 ? 'font-medium' : 'text-muted-foreground'}>Artist</span>
              </div>
              <div className="h-px flex-1 bg-border mx-4" />
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  3
                </div>
                <span className={step >= 3 ? 'font-medium' : 'text-muted-foreground'}>Details</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {step === 1 && <CategorySelector onSelect={handleCategorySelect} />}
        {step === 2 && selectedCategory && (
          <ArtistSelector
            categoryId={selectedCategory}
            onSelect={handleArtistSelect}
            onBack={handleBackToCategories}
          />
        )}
        {step === 3 && selectedArtist && (
          <BookingFormStep
            artistId={selectedArtist}
            onBack={handleBackToArtists}
          />
        )}
      </div>
    </CustomerLayout>
  );
}

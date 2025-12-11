"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Legal Information</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read our terms and policies carefully.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="terms">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6 text-muted-foreground">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                        <p>
                          By accessing and using Artzyra ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. User Accounts</h2>
                        <p>
                          You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. Artist Services</h2>
                        <p>
                          Artists on Artzyra are independent contractors. Artzyra is not responsible for the quality, safety, or legality of the services provided by artists, although we strive to maintain high standards.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Booking and Payments</h2>
                        <p>
                          All bookings must be made through the Artzyra platform. Payments are processed securely. Circumventing the platform to avoid fees is strictly prohibited and may result in account termination.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. Content Guidelines</h2>
                        <p>
                          Users may not post content that is illegal, offensive, or violates intellectual property rights. We reserve the right to remove any content that violates these guidelines.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Termination</h2>
                        <p>
                          We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm">Last updated: December 11, 2025</p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6 text-muted-foreground">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                        <p>
                          We collect information you provide directly to us, such as when you create an account, update your profile, make a booking, or communicate with us. This may include your name, email address, phone number, and payment information.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                        <p>
                          We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you related information, and to communicate with you.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Sharing</h2>
                        <p>
                          We do not share your personal information with third parties except as described in this policy. We may share information with artists or customers as necessary to facilitate bookings.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
                        <p>
                          We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. Cookies</h2>
                        <p>
                          We use cookies and similar technologies to collect information about your interactions with our platform and to improve your experience.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
                        <p>
                          You have the right to access, correct, or delete your personal information. You can manage your information through your account settings.
                        </p>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm">Last updated: December 11, 2025</p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PublicLayout>
  );
}

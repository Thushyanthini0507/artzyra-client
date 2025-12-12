"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { bookingService } from "@/services/booking.service";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;
  const paymentIntentId = searchParams.get("payment_intent");
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentIntentId) return;

      try {
        await apiClient.post("/payments/verify", {
          paymentIntentId,
        });
        setVerified(true);
        toast.success("Payment verified successfully!");
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Failed to verify payment, but don't worry - we're checking it.");
      } finally {
        setLoading(false);
        // Auto-redirect to messages
        setTimeout(() => {
          router.push("/customer/messages");
        }, 3000);
      }
    };

    if (paymentIntentId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [bookingId, paymentIntentId, router]);

  return (
    <PublicLayout>
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <Card className="bg-[#1e1b29] border-white/10 shadow-2xl overflow-hidden">
            <CardContent className="pt-12 pb-10 px-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="h-16 w-16 text-[#5b21b6] animate-spin mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
                  <p className="text-gray-400">Please wait while we confirm your booking.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  
                  <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    Your booking has been confirmed. Redirecting you to the chat...
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link href={`/customer/bookings/${bookingId}`} className="flex-1">
                      <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white h-12">
                        View Booking
                      </Button>
                    </Link>
                    <Link href="/customer/messages" className="flex-1">
                      <Button className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white h-12">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat with Artist
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

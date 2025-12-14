"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { bookingService } from "@/services/booking.service";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import Link from "next/link";

function PaymentSuccessContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;
  const paymentIntentId = searchParams.get("payment_intent");
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artistId, setArtistId] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentIntentId) {
        setError("No payment intent found in URL");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Verifying payment intent:", paymentIntentId);
        const response = await apiClient.post("/payments/verify", {
          paymentIntentId,
        });
        console.log("✅ Verification response:", response.data);
        
        if (response.data.success) {
          setVerified(true);
          toast.success("Payment verified successfully!");
          
          // Fetch booking to get artist ID
          try {
            const bookingResponse = await bookingService.getBookingById(bookingId);
            if (bookingResponse.data) {
              const booking = bookingResponse.data;
              const artist = booking.artist;
              // Extract artist ID - could be object with _id or userId, or just a string
              const extractedArtistId = typeof artist === 'object' 
                ? (artist._id || artist.userId?._id || artist.userId)
                : artist;
              if (extractedArtistId) {
                setArtistId(extractedArtistId);
              }
            }
          } catch (err) {
            console.error("Failed to fetch booking for artist ID:", err);
          }
        } else {
          setError(response.data.message || "Payment verification failed");
        }
      } catch (error: any) {
        console.error("❌ Payment Verification Failed");
        console.error("Full error object:", error);
        console.error("Error message:", error?.message);
        console.error("Error response data:", error?.response?.data);
        console.error("Error status:", error?.response?.status);
        console.error("Payment Intent ID sent:", paymentIntentId);
        
        const errorMsg = error.response?.data?.message || error.message || "Failed to verify payment";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
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
              ) : error ? (
                <div className="flex flex-col items-center">
                  <div className="h-20 w-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">⚠️</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">Verification Issue</h1>
                  <p className="text-gray-300 mb-8 leading-relaxed">{error}</p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link href="/customer" className="flex-1">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
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
                    <Link 
                      href={artistId ? `/chat?artistId=${artistId}` : `/chat?bookingId=${bookingId}`} 
                      className="flex-1"
                    >
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <Loader2 className="h-16 w-16 text-[#5b21b6] animate-spin mx-auto" />
          </div>
        </div>
      </PublicLayout>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

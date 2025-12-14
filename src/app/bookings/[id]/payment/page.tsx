"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { bookingService } from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { formatHourlyRate } from "@/lib/utils/currency";
import { PublicLayout } from "@/components/layout/public-layout";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

import { TermsDialog } from "@/components/customer/TermsDialog";

function CheckoutForm({ booking, clientSecret }: { booking: any; clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setShowTerms(true);
  };

  const handleConfirmedPayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/bookings/${booking._id}/payment/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleInitialSubmit} className="space-y-6">
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        
        {message && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {message}
          </div>
        )}

        <Button 
          disabled={isLoading || !stripe || !elements} 
          id="submit"
          className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white h-12 rounded-xl font-bold text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Pay {formatHourlyRate(booking.totalAmount)}
            </>
          )}
        </Button>
      </form>

      <TermsDialog 
        open={showTerms} 
        onOpenChange={setShowTerms} 
        onConfirm={handleConfirmedPayment} 
      />
    </>
  );
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  
  const [clientSecret, setClientSecret] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPayment = async () => {
      try {
        // 1. Fetch booking details
        const bookingResponse = await bookingService.getById(bookingId);
        if (!bookingResponse.success || !bookingResponse.data) {
          toast.error("Booking not found");
          router.push("/customer");
          return;
        }
        
        const bookingData = bookingResponse.data;
        setBooking(bookingData);
        
        console.log("Booking data:", {
          id: bookingData._id,
          totalAmount: bookingData.totalAmount,
          paymentStatus: bookingData.paymentStatus,
          service: bookingData.service,
        });

        if (bookingData.paymentStatus === "paid") {
          toast.success("This booking is already paid");
          router.push(`/customer/bookings/${bookingId}`);
          return;
        }

        // 2. Create PaymentIntent
        console.log("💳 Initializing payment for booking:", bookingId);
        
        // Send both booking and bookingId to handle potential backend version mismatches
        const payload = {
          bookingId: bookingId,
          booking: bookingId, // For backward compatibility if backend expects this
          // No paymentMethod provided, so backend will return clientSecret for Payment Element
        };
        
        const paymentResponse = await apiClient.post("/payments", payload);

        console.log("Payment response:", paymentResponse.data);

        if (paymentResponse.data.success && paymentResponse.data.data.clientSecret) {
          setClientSecret(paymentResponse.data.data.clientSecret);
        } else {
          const errorMsg = paymentResponse.data.message || paymentResponse.data.error || "Failed to initialize payment";
          console.error("Payment initialization failed:", paymentResponse.data);
          toast.error(errorMsg);
        }
      } catch (error: any) {
        // Detailed error logging
        const errorDetails = {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
        };
        
        console.error("Payment initialization error details:", JSON.stringify(errorDetails, null, 2));
        
        // Extract detailed error message from backend
        const errorMessage = 
          error.response?.data?.message || 
          error.response?.data?.error || 
          error.message || 
          "Failed to load payment details";
        
        toast.error(errorMessage, {
          duration: 5000,
          description: "Check console for details. If persistent, contact support.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      initPayment();
    }
  }, [bookingId, router]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-[#5b21b6]" />
        </div>
      </PublicLayout>
    );
  }

  if (!booking || !clientSecret) {
    return (
      <PublicLayout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Unable to load payment</h1>
          <Button onClick={() => router.push("/customer")}>Return to Dashboard</Button>
        </div>
      </PublicLayout>
    );
  }

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#5b21b6',
      colorBackground: '#1e1b29',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Secure Payment</h1>
            <p className="text-gray-400">Complete your booking with {booking.artist?.name}</p>
          </div>

          <Card className="bg-[#13111c] border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-6">
              <CardTitle className="text-xl text-white flex justify-between items-center">
                <span>Total Amount</span>
                <span className="text-[#a78bfa] text-2xl">{formatHourlyRate(booking.totalAmount)}</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                {booking.service} • {booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm booking={booking} clientSecret={clientSecret} />
              </Elements>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" />
            <span>Payments are secured by Stripe</span>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

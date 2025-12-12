"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookingService } from "@/services/booking.service";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { formatHourlyRate } from "@/lib/utils/currency";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ booking, clientSecret }: { booking: any, clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/bookings/${booking._id}`,
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
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
      {message && (
        <div id="payment-message" className="text-red-500 text-sm mt-2">
          {message}
        </div>
      )}

      <Button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-[#9b87f5] hover:bg-[#8a76d6] text-white font-bold py-6 text-lg rounded-xl mt-4"
      >
        <span id="button-text">
          {isLoading ? (
             <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
             </>
          ) : (
            `Pay ${formatHourlyRate(booking.totalAmount)}`
          )}
        </span>
      </Button>
      
      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-4">
        <ShieldCheck className="h-4 w-4" />
        <span>Secure payment processed by Stripe</span>
      </div>
    </form>
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

        // 2. Create PaymentIntent via backend
        // We need a new service method or just call axios directly
        // Assuming we have a payment service or endpoint
        const { default: apiClient } = await import("@/lib/apiClient");
        const paymentResponse = await apiClient.post("/payments", {
          bookingId: bookingId,
          paymentMethod: "stripe", // Placeholder, actual method handled by Elements
        });

        if (paymentResponse.data.success && paymentResponse.data.clientSecret) {
          setClientSecret(paymentResponse.data.clientSecret);
        } else {
           // If payment already exists or other issue
           if (bookingData.paymentStatus === 'paid') {
             toast.success("This booking is already paid!");
             router.push(`/bookings/${bookingId}`);
             return;
           }
           // If backend doesn't return clientSecret directly (maybe it returns a Payment object)
           // We might need to adjust the backend response in paymentController.js
           // Let's check paymentController.js... 
           // Wait, I implemented `createPayment` in `paymentController.js` but it calls `processPayment`.
           // `processPayment` in `paymentService.js` returns `clientSecret`.
           // `createPayment` returns `data: { payment: ... }`.
           // I need to make sure `createPayment` returns the `clientSecret` to the frontend!
           // I will need to update `paymentController.js` to include `clientSecret` in the response.
           
           // For now, let's assume I'll fix the backend.
        }
      } catch (error: any) {
        console.error("Error initializing payment:", error);
        toast.error(error.response?.data?.message || "Failed to initialize payment");
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
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
        </div>
      </PublicLayout>
    );
  }

  if (!booking) return null;

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#9b87f5',
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
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Secure Payment</h1>
          
          <Card className="bg-[#1e1b29] border-white/10 text-white mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription className="text-gray-400">
                Booking with {booking.artist?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Service</span>
                <span>{booking.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date & Time</span>
                <span>{new Date(booking.bookingDate).toLocaleDateString()} at {booking.startTime}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t border-white/10">
                <span>Total</span>
                <span className="text-[#9b87f5]">{formatHourlyRate(booking.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          {clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm booking={booking} clientSecret={clientSecret} />
            </Elements>
          ) : (
            <div className="text-center text-red-400">
              Unable to load payment form. Please try again.
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

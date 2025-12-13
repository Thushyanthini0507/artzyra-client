"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePayment } from "@/hooks/useCustomerHooks";
import { Loader2, CreditCard } from "lucide-react";
import { formatLKR } from "@/lib/utils/currency";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
  onSuccess: () => void;
}

export function PaymentDialog({ open, onOpenChange, booking, onSuccess }: PaymentDialogProps) {
  const { createPayment, loading } = useCreatePayment();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePayment = async () => {
    if (!booking) return;
    
    console.log("💳 Initiating payment with data:", {
      bookingId: booking._id,
      paymentMethod,
    });
    
    const result = await createPayment({
      bookingId: booking._id,
      paymentMethod,
    });

    if (result) {
      onOpenChange(false);
      onSuccess();
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Total Amount</p>
              <p className="text-sm text-muted-foreground">For {booking.service}</p>
            </div>
            <div className="font-bold text-2xl">{formatLKR(booking.totalAmount)}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="cash">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "card" && (
            <div className="space-y-2">
              <Label>Card Details (Demo)</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="0000 0000 0000 0000" disabled />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handlePayment} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pay Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

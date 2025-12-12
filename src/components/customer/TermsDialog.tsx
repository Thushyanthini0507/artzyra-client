"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function TermsDialog({ open, onOpenChange, onConfirm }: TermsDialogProps) {
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    if (agreed) {
      onConfirm();
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#1e1b29] border-white/10 text-white max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">Terms & Conditions</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Please review and agree to the following terms before proceeding with your payment.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="h-[300px] w-full rounded-md border border-white/10 p-4 bg-[#13111c]">
          <div className="space-y-4 text-sm text-gray-300">
            <h3 className="font-bold text-white text-lg">1. Booking & Payments</h3>
            <p>
              By proceeding, you agree to pay the total amount listed. Payments are processed securely via Stripe.
              A booking is only confirmed once payment is successfully received.
            </p>

            <h3 className="font-bold text-white text-lg">2. Cancellation Policy</h3>
            <p>
              Cancellations made more than 24 hours before the scheduled time are eligible for a full refund.
              Cancellations within 24 hours may be subject to a cancellation fee of up to 50%.
            </p>

            <h3 className="font-bold text-white text-lg">3. Artist Communication</h3>
            <p>
              All communication regarding the project details should happen within the Artzyra platform.
              Sharing personal contact information before a booking is confirmed is prohibited.
            </p>

            <h3 className="font-bold text-white text-lg">4. Code of Conduct</h3>
            <p>
              Respectful behavior is expected from both parties. Harassment or inappropriate conduct will result in account suspension.
            </p>

            <h3 className="font-bold text-white text-lg">5. Dispute Resolution</h3>
            <p>
              In case of a dispute, Artzyra will act as a mediator. Both parties agree to provide necessary evidence for resolution.
            </p>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2 py-4">
          <Checkbox 
            id="terms" 
            checked={agreed} 
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
            className="border-white/50 data-[state=checked]:bg-[#9b87f5] data-[state=checked]:border-[#9b87f5]"
          />
          <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I agree to the Terms & Conditions and Cancellation Policy
          </Label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={!agreed}
            className="bg-[#9b87f5] hover:bg-[#8a76d6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            I Agree & Pay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

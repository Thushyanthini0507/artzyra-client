"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePayment } from "@/hooks/useCustomerHooks";
import { formatLKR } from "@/lib/utils/currency";

const paymentSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  cardNumber: z.string().min(16, "Invalid card number"),
  expiry: z.string().min(5, "Invalid expiry date (MM/YY)"),
  cvc: z.string().min(3, "Invalid CVC"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
}

export function PaymentForm({ bookingId, amount, onSuccess }: PaymentFormProps) {
  const { createPayment, loading } = useCreatePayment();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: amount.toString(),
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    const result = await createPayment({
      bookingId: bookingId,
      paymentMethod: "credit_card",
    });
    if (result && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (LKR)</Label>
        <Input id="amount" {...register("amount")} readOnly />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input id="cardNumber" placeholder="0000 0000 0000 0000" {...register("cardNumber")} />
        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry (MM/YY)</Label>
          <Input id="expiry" placeholder="MM/YY" {...register("expiry")} />
          {errors.expiry && <p className="text-sm text-red-500">{errors.expiry.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input id="cvc" placeholder="123" {...register("cvc")} />
          {errors.cvc && <p className="text-sm text-red-500">{errors.cvc.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : `Pay ${formatLKR(amount)}`}
      </Button>
    </form>
  );
}

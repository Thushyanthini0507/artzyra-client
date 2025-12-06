import { Booking } from "./booking";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  _id: string;
  booking: Booking | string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
}

export interface CreatePaymentData {
  booking: string;
  amount: number;
  paymentMethod: string;
}


import { Booking, PaymentStatus } from "./booking";

// PaymentStatus is imported from booking.ts to avoid duplicate exports
// This file exports Payment interface

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
  bookingId: string;
  paymentMethod?: string;
}


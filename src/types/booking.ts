import { Customer } from "./customer";
import { Artist } from "./artist";

export type BookingStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export interface Booking {
  _id: string;
  customer: Customer | string;
  artist: Artist | string;
  service: string;
  date: string;
  status: BookingStatus;
  totalAmount: number;
  location: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  artist: string;
  service: string;
  date: string;
  totalAmount: number;
  location: string;
  specialRequests?: string;
}

export interface UpdateBookingData {
  service?: string;
  date?: string;
  status?: BookingStatus;
  totalAmount?: number;
  location?: string;
  specialRequests?: string;
}


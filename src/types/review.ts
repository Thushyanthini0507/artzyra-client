import { Booking } from "./booking";
import { Artist } from "./artist";
import { Customer } from "./customer";

export interface Review {
  _id: string;
  booking: Booking | string;
  artist: Artist | string;
  customer: Customer | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewData {
  booking: string;
  artist: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}


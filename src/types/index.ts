export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "artist" | "admin";
  profileImage?: string;
}

export interface Artist extends User {
  category: string;
  skills: string[];
  hourlyRate: number;
  bio: string;
  availability: string;
  rating?: number;
  reviewCount?: number;
}

export interface Customer extends User {
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Booking {
  _id: string;
  customer: Customer | string;
  artist: Artist | string;
  service: string;
  date: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  totalAmount: number;
  location: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  booking: Booking | string;
  artist: Artist | string;
  customer: Customer | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  booking: Booking | string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
}

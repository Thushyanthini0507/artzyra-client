export type UserRole = "admin" | "customer" | "artist";
export type UserStatus = "pending" | "approved" | "rejected";

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  status?: UserStatus;
  // Artist fields
  category?: string;
  skills?: string[];
  bio?: string;
  hourlyRate?: number;
  availability?: string;

  // Customer fields
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profileImage?: string;
}

// We no longer need manual token management functions as we use HttpOnly cookies

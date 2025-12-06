import { User } from "./user";

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

export interface CreateCustomerData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface UpdateCustomerData {
  name?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  profileImage?: string;
  dateOfBirth?: string;
  gender?: string;
  preferences?: {
    notifications?: boolean;
    emailUpdates?: boolean;
    smsUpdates?: boolean;
    favoriteCategories?: string[];
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  bio?: string;
}


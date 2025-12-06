export type UserRole = "customer" | "artist" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  status?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  [key: string]: any;
}


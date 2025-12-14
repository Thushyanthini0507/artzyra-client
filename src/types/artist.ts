import { User } from "./user";

export interface Artist extends User {
  category: string;
  skills: string[];
  hourlyRate: number;
  bio: string;
  availability: string;
  rating?: number;
  reviewCount?: number;
  artistType?: "physical" | "remote";
}

export interface CreateArtistData {
  name: string;
  email: string;
  password: string;
  category: string;
  skills: string[];
  hourlyRate: number;
  bio: string;
  availability: string;
}

export interface UpdateArtistData {
  name?: string;
  category?: string;
  skills?: string[];
  hourlyRate?: number;
  bio?: string;
  availability?: string;
  profileImage?: string;
}


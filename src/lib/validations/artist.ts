import * as z from "zod";
import { isValidSriLankanPhone } from "@/lib/utils/phoneValidation";

// Custom phone validation for Zod
const phoneSchema = z.string().optional().refine(
  (val) => !val || isValidSriLankanPhone(val),
  {
    message: "Please provide a valid Sri Lankan phone number (e.g., 0712345678 or 712345678)",
  }
);

// URL validation schema
const urlSchema = z.string().optional().refine(
  (val) => !val || z.string().url().safeParse(val).success,
  {
    message: "Please provide a valid URL (e.g., https://example.com)",
  }
);

export const artistProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  profileImage: z.string().optional().refine(
    (val) => !val || val === "" || z.string().url().safeParse(val).success,
    {
      message: "Profile image must be a valid URL",
    }
  ),
  
  phone: phoneSchema,
  
  bio: z
    .string()
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
  
  category: z
    .string()
    .min(1, "Category is required"),
  
  skills: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const skills = val.split(",").map((s) => s.trim()).filter(Boolean);
        return skills.length <= 20;
      },
      {
        message: "Maximum 20 skills allowed",
      }
    ),
  
  hourlyRate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 1000000;
      },
      {
        message: "Hourly rate must be between 0 and 1,000,000 LKR",
      }
    ),
  
  availability: z
    .string()
    .max(200, "Availability description must be less than 200 characters")
    .optional(),
  
  portfolio: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const urls = val.split(",").map((u) => u.trim()).filter(Boolean);
        return urls.every((url) => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        });
      },
      {
        message: "All portfolio URLs must be valid (e.g., https://example.com)",
      }
    ),
  
  website: urlSchema,
  
  socialLinks: z.object({
    facebook: urlSchema,
    instagram: urlSchema,
    twitter: urlSchema,
    linkedin: urlSchema,
    youtube: urlSchema,
  }).optional(),
  
  experience: z.object({
    years: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const num = parseInt(val);
          return !isNaN(num) && num >= 0 && num <= 100;
        },
        {
          message: "Years of experience must be between 0 and 100",
        }
      ),
    description: z
      .string()
      .max(1000, "Experience description must be less than 1000 characters")
      .optional(),
  }).optional(),
  
  languages: z
    .string()
    .max(200, "Languages must be less than 200 characters")
    .optional(),
  
  location: z.object({
    city: z
      .string()
      .max(100, "City must be less than 100 characters")
      .optional(),
    state: z
      .string()
      .max(100, "State must be less than 100 characters")
      .optional(),
    country: z
      .string()
      .max(100, "Country must be less than 100 characters")
      .optional(),
    zipCode: z
      .string()
      .max(20, "Zip code must be less than 20 characters")
      .optional(),
  }).optional(),
});

export type ArtistProfileFormData = z.infer<typeof artistProfileSchema>;


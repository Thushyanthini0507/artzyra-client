import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const customerRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\+94\d{9}$/, "Phone number must start with +94 and have 9 digits after"),
});

export const artistRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\+94\d{9}$/, "Phone number must start with +94 and have 9 digits after"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  skills: z.string().min(1, "Skills are required"),
  hourlyRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Hourly rate must be a positive number",
  }),
  availability: z.string().min(1, "Availability is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CustomerRegisterFormData = z.infer<typeof customerRegisterSchema>;
export type ArtistRegisterFormData = z.infer<typeof artistRegisterSchema>;

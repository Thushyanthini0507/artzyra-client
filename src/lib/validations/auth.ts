import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address (e.g., example@domain.com)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const customerRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address (e.g., example@domain.com)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\+94\d{9}$/, "Phone number must start with +94 and have 9 digits after"),
});

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  deliveryTime: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
    message: "Delivery time must be at least 1 day",
  }),
  description: z.string().optional(),
});

export const artistRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address (e.g., example@domain.com)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\+94\d{9}$/, "Phone number must start with +94 and have 9 digits after"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  skills: z.string().optional(),
  hourlyRate: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
    message: "Hourly rate must be a positive number",
  }),
  availability: z.string().optional(),
  deliveryTime: z.string().optional(),
  services: z.array(serviceSchema).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CustomerRegisterFormData = z.infer<typeof customerRegisterSchema>;
export type ArtistRegisterFormData = z.infer<typeof artistRegisterSchema>;

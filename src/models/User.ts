import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "customer" | "artist";
  status: "pending" | "approved" | "rejected";
  // Artist specific fields
  category?: string;
  skills?: string[];
  bio?: string;
  hourlyRate?: number;
  availability?: string;

  // Customer specific fields
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Don't return password by default
    role: {
      type: String,
      enum: ["admin", "customer", "artist"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Artist fields
    category: { type: String },
    skills: { type: [String] },
    bio: { type: String },
    hourlyRate: { type: Number },
    availability: { type: String },

    // Customer fields
    phone: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    profileImage: { type: String },
  },
  { timestamps: true }
);

// Prevent recompilation of model in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

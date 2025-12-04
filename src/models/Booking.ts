import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  artist: mongoose.Types.ObjectId;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  specialRequests?: string;
  status: "pending" | "accepted" | "confirmed" | "rejected" | "completed" | "cancelled";
  totalAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    artist: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookingDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, required: true },
    specialRequests: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "confirmed", "rejected", "completed", "cancelled"],
      default: "confirmed", // Auto-confirm bookings
    },
    totalAmount: { type: Number },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;

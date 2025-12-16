import { Customer } from "./customer";
import { Artist } from "./artist";

export type BookingStatus = "pending" | "in_progress" | "review" | "completed" | "cancelled" | "declined" | "confirmed";
export type PaymentStatus = "pending" | "paid" | "succeeded" | "refunded" | "failed" | "partial";
export type PackageType = "basic" | "standard" | "premium" | "custom";
export type UrgencyType = "normal" | "express";
export type PricingType = "package" | "custom_quote";
export type PaymentType = "advance" | "full";

export interface Revision {
  _id?: string;
  requestedBy: string;
  requestedAt: Date;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  completedAt?: Date;
}

export interface FinalApproval {
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
}

export interface Cancellation {
  cancelledBy: string;
  cancelledAt: Date;
  reason?: string;
  refundAmount?: number;
  refundStatus?: "pending" | "processed" | "rejected";
  cancellationWindow?: number;
}

export interface Dispute {
  raisedBy: string;
  raisedAt: Date;
  reason?: string;
  description?: string;
  evidence?: string[];
  status?: "open" | "resolved" | "closed";
  adminDecision?: string;
  resolvedAt?: Date;
}

export interface CustomQuote {
  amount: number;
  approved: boolean;
  requestedAt?: Date;
  approvedAt?: Date;
}

export interface UploadedFile {
  url: string;
  filename: string;
  fileType: string;
  uploadedAt?: Date;
}

export interface Booking {
  _id: string;
  customer: Customer | string;
  artist: Artist | string;
  // Service Selection
  service: string;
  package?: PackageType;
  customRequirements?: string;
  // Project Details
  projectTitle?: string;
  projectDescription?: string;
  referenceLinks?: string[];
  uploadedFiles?: UploadedFile[];
  // Delivery Timeline
  expectedDeliveryDate?: string;
  urgency?: UrgencyType;
  revisionCount?: {
    requested: number;
    used: number;
    limit: number;
  };
  // Communication
  emailUpdates?: boolean;
  // Pricing & Payment
  pricingType?: PricingType;
  packagePrice?: number;
  customQuote?: CustomQuote;
  paymentType?: PaymentType;
  advancePercentage?: number;
  // Availability
  estimatedStartDate?: string;
  artistAvailabilityStatus?: "available" | "busy";
  // Legacy fields
  date?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  location?: string;
  specialRequests?: string;
  notes?: string;
  // Status
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  totalAmount: number;
  amountPaid?: number;
  amountRefunded?: number;
  stripePaymentIntentId?: string;
  // Revision & Approval
  revisions?: Revision[];
  finalApproval?: FinalApproval;
  // Cancellation & Refund
  cancellation?: Cancellation;
  // Dispute
  dispute?: Dispute;
  // Chat
  chatRoomId?: string;
  // Review
  review?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  artistId: string;
  service: string;
  package?: PackageType;
  customRequirements?: string;
  projectTitle?: string;
  projectDescription?: string;
  referenceLinks?: string[];
  uploadedFiles?: UploadedFile[];
  expectedDeliveryDate?: string;
  urgency?: UrgencyType;
  revisionCount?: { limit: number };
  emailUpdates?: boolean;
  pricingType?: PricingType;
  packagePrice?: number;
  customQuote?: CustomQuote;
  paymentType?: PaymentType;
  advancePercentage?: number;
  // Legacy fields
  date?: string;
  bookingDate?: string;
  startTime?: string;
  duration?: number;
  location?: string;
  notes?: string;
  totalAmount: number;
  specialRequests?: string;
}

export interface UpdateBookingData {
  service?: string;
  status?: BookingStatus;
  totalAmount?: number;
  location?: string;
  specialRequests?: string;
  projectDescription?: string;
}

export interface RevisionRequest {
  description?: string;
}

export interface ApprovalRequest {
  notes?: string;
}

export interface CancellationRequest {
  reason?: string;
}


import mongoose, { Schema, Document, Model } from "mongoose";

export interface IImage extends Document {
  user: mongoose.Types.ObjectId;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  originalFilename?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema: Schema<IImage> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cloudinaryUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    originalFilename: { type: String },
    width: { type: Number },
    height: { type: Number },
    fileSize: { type: Number },
  },
  { timestamps: true }
);

// Prevent recompilation of model in development
const Image: Model<IImage> =
  mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);

export default Image;


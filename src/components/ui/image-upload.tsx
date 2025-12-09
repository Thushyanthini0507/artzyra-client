"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X, Upload } from "lucide-react";
import Image from "next/image";
import { uploadService, ImageType } from "@/services/upload.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  imageType?: ImageType;
  className?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  imageType = "customer_profile",
  className,
  label = "Upload Image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadService.uploadImage(file, imageType);

      if (response.success) {
        onChange(response.data.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(response.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong during upload");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div className="flex flex-col items-center justify-center gap-4">
        {value ? (
          <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-muted">
            <div className="relative h-full w-full">
              <Image
                fill
                src={value}
                alt="Profile Image"
                className="object-cover"
              />
            </div>
            <button
              onClick={handleRemove}
              className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-1 rounded-full shadow-sm hover:bg-destructive/90 transition-colors"
              type="button"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div 
            onClick={triggerUpload}
            className="h-40 w-40 rounded-full border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors bg-muted/10"
          >
            <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground font-medium">Click to upload</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={disabled || isUploading}
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isUploading}
            onClick={triggerUpload}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {label}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api/axios";

interface ImageData {
  _id: string;
  cloudinaryUrl: string;
  originalFilename?: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function MayPage() {
  const { user, loading: authLoading } = useAuth();
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/images");
      const responseData = response.data as { success?: boolean; data?: ImageData[] } | ImageData[];
      
      // Handle both wrapped response { success, data } and direct array
      let data: ImageData[];
      if (Array.isArray(responseData)) {
        data = responseData;
      } else if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        data = Array.isArray(responseData.data) ? responseData.data : [];
      } else {
        data = [];
      }
      
      setImages(data);
    } catch (error: unknown) {
      console.error("Failed to fetch images:", error);
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      toast.error(axiosError.response?.data?.error || axiosError.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file");
      return;
    }

    if (!user) {
      toast.error("Please log in to upload images");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Image uploaded successfully!");
      
      // Reset form
      handleRemoveFile();
      
      // Refresh images list
      fetchImages();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Get optimized image URL (300px width)
  const getOptimizedImageUrl = (url: string) => {
    // If already contains transformation, return as is
    if (url.includes("w_300") || url.includes("c_limit") || url.includes("/transform/")) {
      return url;
    }
    
    // Check if it's a Cloudinary URL
    if (!url.includes("cloudinary.com")) {
      return url; // Not a Cloudinary URL, return as is
    }
    
    // Add Cloudinary transformation for 300px width
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
    // We need to insert transformations after /upload/
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) {
      return url; // Invalid Cloudinary URL format
    }
    
    // Insert transformation parameters
    const beforeTransform = url.substring(0, uploadIndex + 8); // Include "/upload/"
    const afterUpload = url.substring(uploadIndex + 8);
    
    // Add transformation: w_300 (width 300px), c_limit (maintain aspect ratio), q_auto (auto quality)
    return `${beforeTransform}w_300,c_limit,q_auto,f_auto/${afterUpload}`;
  };

  return (
    <PublicLayout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">May Gallery</h1>
          <p className="text-muted-foreground">
            Upload and share your images with the community
          </p>
        </div>

        {/* Upload Section - Only for logged-in users */}
        {!authLoading && user && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select an image file to upload (Max 10MB, JPG/PNG/GIF)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!preview ? (
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to select image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                ) : (
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex gap-2">
                  {!preview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>
                  )}
                  {preview && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveFile}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex-1"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login Prompt for non-logged-in users */}
        {!authLoading && !user && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground mb-4">
                  Please log in to upload images
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gallery Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Gallery</h2>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground">No images uploaded yet</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <Card key={image._id} className="overflow-hidden">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={getOptimizedImageUrl(image.cloudinaryUrl)}
                      alt={image.originalFilename || "Uploaded image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium truncate">
                      {image.user?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}


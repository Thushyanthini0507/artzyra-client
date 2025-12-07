"use client";

import { useEffect, useState, useRef } from "react";
import { ArtistLayoutNew } from "@/components/layout/artist-layout-new";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { artistService } from "@/services/artist.service";
import { uploadService } from "@/services/upload.service";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, X, Loader2, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function ArtistPortfolioPage() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await artistService.getProfile();
      if (response.success && response.data) {
        const artist = response.data.artist || response.data;
        setPortfolio(Array.isArray(artist.portfolio) ? artist.portfolio : []);
      }
    } catch (error) {
      console.error("Failed to fetch portfolio", error);
      toast.error("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview("");
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile && !imageUrl) {
      toast.error("Please select an image file or enter an image URL");
      return;
    }

    setUploading(true);

    try {
      let imageUrlToAdd = "";

      if (selectedFile) {
        // Upload file
        const data = await uploadService.uploadImage(selectedFile);
        if (!data.success) {
          throw new Error(data.error || "Upload failed");
        }
        imageUrlToAdd = data.data?.url || data.data?.cloudinaryUrl || "";
        if (!imageUrlToAdd) {
          throw new Error("Upload succeeded but no URL returned");
        }
      } else if (imageUrl) {
        // Use provided URL
        imageUrlToAdd = imageUrl.trim();
        if (!imageUrlToAdd.startsWith("http://") && !imageUrlToAdd.startsWith("https://")) {
          throw new Error("Please provide a valid URL starting with http:// or https://");
        }
      }

      // Add to portfolio
      const updatedPortfolio = [...portfolio, imageUrlToAdd];
      await updatePortfolio(updatedPortfolio);

      toast.success("Image added to portfolio successfully!");
      handleRemoveFile();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (!confirm("Are you sure you want to remove this image from your portfolio?")) {
      return;
    }

    try {
      const updatedPortfolio = portfolio.filter((_, i) => i !== index);
      await updatePortfolio(updatedPortfolio);
      toast.success("Image removed from portfolio");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to remove image");
    }
  };

  const updatePortfolio = async (newPortfolio: string[]) => {
    setSaving(true);
    try {
      const response = await artistService.updateProfile({
        portfolio: newPortfolio,
      });

      if (response.success) {
        setPortfolio(newPortfolio);
      } else {
        throw new Error(response.error || "Failed to update portfolio");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update portfolio");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ArtistLayoutNew>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ArtistLayoutNew>
    );
  }

  return (
    <ArtistLayoutNew>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio images to showcase your work to potential clients
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Image</CardTitle>
            <CardDescription>
              Upload an image file or add an image URL to your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Image File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                {selectedFile && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="image-url">Or Enter Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Preview */}
            {(preview || imageUrl) && (
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={preview || imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={() => {
                      toast.error("Failed to load image preview");
                    }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUploadImage}
              disabled={uploading || saving || (!selectedFile && !imageUrl)}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Portfolio
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Portfolio Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Your Portfolio ({portfolio.length} images)</CardTitle>
            <CardDescription>
              These images will be displayed on your public profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {portfolio.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No portfolio images yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload your first image to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolio.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
                  >
                    <img
                      src={imageUrl}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(index)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ArtistLayoutNew>
  );
}



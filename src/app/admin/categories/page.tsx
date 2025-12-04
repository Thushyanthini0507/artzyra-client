"use client";

import { useEffect, useState, useRef } from "react";
import { adminService } from "@/lib/api/services/adminService";
import { uploadService } from "@/lib/api/services/uploadService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { AdminLayout } from "@/components/layouts/admin-layout";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCategories();
      if (response.success && response.data) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error("Failed to fetch categories:", response.error);
        toast.error(response.error || "Failed to load categories");
      }
    } catch (error: any) {
      console.error("Failed to fetch categories", error);
      toast.error(error.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 10MB for Cloudinary)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        toast.error("Image size must be less than 10MB.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setSelectedFile(file);

      // Convert to base64 for preview only
      const reader = new FileReader();
      reader.onerror = () => {
        toast.error("Failed to read image file");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        // We don't set formData.image here anymore, we'll handle it on submit
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || formData.name.trim().length === 0) {
      toast.error("Category name is required");
      return;
    }

    try {
      let imageUrl = formData.image;

      // Upload image if a new file is selected
      if (selectedFile) {
        const uploadToast = toast.loading("Uploading image...");
        const uploadResult = await uploadService.uploadImage(selectedFile);
        toast.dismiss(uploadToast);

        if (!uploadResult.success || !uploadResult.data) {
          toast.error(uploadResult.error || "Failed to upload image");
          return;
        }
        imageUrl = uploadResult.data.url;
      }

      const dataToSubmit = {
        ...formData,
        image: imageUrl,
      };

      console.log("Submitting category with data:", {
        name: dataToSubmit.name,
        hasDescription: !!dataToSubmit.description,
        hasImage: !!dataToSubmit.image,
      });

      let response;
      if (editingCategory) {
        console.log("Updating category:", editingCategory._id);
        response = await adminService.updateCategory(
          editingCategory._id,
          dataToSubmit
        );
        if (response.success) {
          toast.success("Category updated");
        } else {
          console.error("Update failed:", response.error);
          toast.error(response.error || "Failed to update category");
          return;
        }
      } else {
        console.log("Creating new category");
        response = await adminService.createCategory(dataToSubmit);
        console.log("Create response:", response);

        if (response.success) {
          toast.success("Category created successfully");
        } else {
          console.error("Create failed:", response.error);
          toast.error(response.error || "Failed to create category");
          return;
        }
      }

      handleDialogOpenChange(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Category save error:", error);
      console.error("Error details:", {
        message: error.message,
        error: error.error,
        stack: error.stack,
      });
      toast.error(
        error.message ||
          error.error ||
          "Failed to save category. Check console for details."
      );
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
    setImagePreview(category.image || "");
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setEditingCategory(null);
      setFormData({ name: "", description: "", image: "" });
      setImagePreview("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", image: "" });
    setImagePreview("");
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const response = await adminService.deleteCategory(id);
      if (response.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(response.error || "Failed to delete category");
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || error.error || "Failed to delete category");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="ml-20">
            <h1 className="text-3xl font-bold tracking-tight">
              Categories
            </h1>
            <p className="text-muted-foreground">Manage artist categories.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={handleAddCategory}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Add Category"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="e.g., Digital Art, Photography"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe this category..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="space-y-2">
                    {imagePreview ? (
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Category preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                    <Input
                      ref={fileInputRef}
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {!imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Choose Image
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-6xl">
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No categories found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>
                          {category.image ? (
                            <div className="relative w-16 h-16 rounded overflow-hidden">
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(category._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

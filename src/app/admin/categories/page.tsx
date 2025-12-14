"use client";

import { useEffect, useState, useRef } from "react";
import { adminService } from "@/services/admin.service";
import { uploadService } from "@/services/upload.service";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Image as ImageIcon, X, Search, RefreshCcw, Layers } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  type?: "physical" | "remote";
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    type: "physical",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCategories({ limit: 100 });
      if (response.success && response.data) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.error(response.error || "Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
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
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB.");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      let imageUrl = formData.image;

      if (selectedFile) {
        const uploadToast = toast.loading("Uploading image...");
        try {
          const uploadResult = await uploadService.uploadImage(selectedFile, "category");
          toast.dismiss(uploadToast);
          if (uploadResult.success && uploadResult.data) {
            imageUrl = uploadResult.data.url;
          } else {
            throw new Error(uploadResult.error || "Upload failed");
          }
        } catch (error) {
          toast.dismiss(uploadToast);
          toast.error("Failed to upload image");
          return;
        }
      }

      const dataToSubmit = { ...formData, image: imageUrl };
      const response = editingCategory
        ? await adminService.updateCategory(editingCategory._id, dataToSubmit)
        : await adminService.createCategory(dataToSubmit);

      if (response.success) {
        toast.success(`Category ${editingCategory ? "updated" : "created"} successfully`);
        handleDialogOpenChange(false);
        // Force a refresh to ensure UI shows updated data
        await fetchCategories();
      } else {
        toast.error(response.error || "Operation failed");
      }
    } catch (error: any) {
      console.error("Error saving category:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save category";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      type: category.type || "physical",
    });
    setImagePreview(category.image || "");
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingCategory(null);
      setFormData({ name: "", description: "", image: "", type: "physical" });
      setImagePreview("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Categories
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage artist categories and specializations.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={fetchCategories} 
              variant="outline" 
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all"
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg shadow-purple-500/20">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1625] border-white/10 text-white sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g., Digital Art"
                      className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-gray-300">Type *</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                      className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none"
                    >
                      <option value="physical">Physical (In-person)</option>
                      <option value="remote">Remote (Online)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe this category..."
                      rows={3}
                      className="bg-black/20 border-white/10 text-white focus:border-purple-500/50 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Cover Image</Label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-4 hover:bg-white/5 transition-colors text-center">
                      {imagePreview ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={handleRemoveImage}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="py-8 cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-300 font-medium">Click to upload image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDialogOpenChange(false)}
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                      {editingCategory ? "Save Changes" : "Create Category"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 rounded-xl h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white">No categories found</h3>
            <p className="text-gray-400 mt-1">Try creating a new category or adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Card 
                key={category._id} 
                className="group bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-md overflow-hidden hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-lg font-bold text-white truncate">{category.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${category.type === 'remote' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                      {category.type === 'remote' ? 'Remote' : 'Physical'}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400 line-clamp-2 h-10">
                    {category.description || "No description provided."}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => handleDelete(category._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

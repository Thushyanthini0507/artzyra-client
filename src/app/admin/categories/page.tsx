"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useAdminHooks";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const { categories, loading, refresh } = useAdminCategories();
  const { createCategory, loading: creating } = useCreateCategory();
  const { updateCategory, loading: updating } = useUpdateCategory();
  const { deleteCategory, loading: deleting } = useDeleteCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    if (editingCategory) {
      const result = await updateCategory(editingCategory._id, data);
      if (result.success) {
        setEditingCategory(null);
        reset();
        refresh();
      }
    } else {
      const result = await createCategory(data);
      if (result.success) {
        setIsCreateOpen(false);
        reset();
        refresh();
      }
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    reset({ name: category.name, description: category.description });
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      const result = await deleteCategory(categoryId);
      if (result.success) {
        refresh();
      }
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    setEditingCategory(null);
    reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage service categories</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>List of all service categories in the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No categories found</p>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center justify-between border p-4 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category._id)}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateOpen || !!editingCategory} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update category details" : "Add a new service category"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" {...register("description")} rows={4} />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating || updating}>
                  {creating || updating ? "Saving..." : editingCategory ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

import apiClient from "@/lib/apiClient";

export const categoryService = {
  getAll: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },
  getAllCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },
  getById: async (categoryId: string) => {
    const response = await apiClient.get(`/categories/${categoryId}`);
    return response.data;
  },
  getArtistsByCategory: async (categoryId: string, params?: any) => {
    const response = await apiClient.get(`/categories/${categoryId}/artists`, {
      params,
    });
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post("/categories", data);
    return response.data;
  },
  createCategory: async (data: any) => {
    const response = await apiClient.post("/categories", data);
    return response.data;
  },
  update: async (categoryId: string, data: any) => {
    const response = await apiClient.put(`/categories/${categoryId}`, data);
    return response.data;
  },
  updateCategory: async (categoryId: string, data: any) => {
    const response = await apiClient.put(`/categories/${categoryId}`, data);
    return response.data;
  },
  delete: async (categoryId: string) => {
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  },
  deleteCategory: async (categoryId: string) => {
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  },
};


import api from "../axios";

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get("/api/categories");
    return response.data;
  },
  getCategoryById: async (categoryId: string) => {
    const response = await api.get(`/api/categories/${categoryId}`);
    return response.data;
  },
  getArtistsByCategory: async (categoryId: string, params?: any) => {
    const response = await api.get(`/api/categories/${categoryId}/artists`, { params });
    return response.data;
  },
  createCategory: async (data: any) => {
    const response = await api.post("/api/categories", data);
    return response.data;
  },
  updateCategory: async (categoryId: string, data: any) => {
    const response = await api.put(`/api/categories/${categoryId}`, data);
    return response.data;
  },
  deleteCategory: async (categoryId: string) => {
    const response = await api.delete(`/api/categories/${categoryId}`);
    return response.data;
  },
};

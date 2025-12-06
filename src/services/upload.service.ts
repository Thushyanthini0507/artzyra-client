import apiClient from "@/lib/apiClient";

export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};


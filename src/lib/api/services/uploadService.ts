import api from "../axios";
import { ApiResponse } from "../../api";

export const uploadService = {
  uploadImage: async (file: File): Promise<ApiResponse<{ url: string; publicId: string }>> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: {
          url: response.data.data?.cloudinaryUrl || response.data.cloudinaryUrl,
          publicId: response.data.data?.cloudinaryPublicId || response.data.cloudinaryPublicId,
        },
      };
    } catch (error: any) {
      console.error("Upload service error:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Network error during upload",
      };
    }
  },
};

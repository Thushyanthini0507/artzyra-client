import api from "../apiClient";

// Define ApiResponse type locally
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export const uploadService = {
  uploadImage: async (
    file: File
  ): Promise<ApiResponse<{ url: string; publicId: string }>> => {
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
          publicId:
            response.data.data?.cloudinaryPublicId ||
            response.data.cloudinaryPublicId,
        },
      };
    } catch (error: unknown) {
      console.error("Upload service error:", error);
      const axiosError = error as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      return {
        success: false,
        error:
          axiosError.response?.data?.error ||
          axiosError.message ||
          "Network error during upload",
      };
    }
  },
};

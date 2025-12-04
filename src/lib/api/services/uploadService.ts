import { ApiResponse } from "../../api";

export const uploadService = {
  uploadImage: async (file: File): Promise<ApiResponse<{ url: string; publicId: string }>> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies (HTTP-only token) in requests
        // Do not set Content-Type header, let browser set it with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to upload image",
        };
      }

      return {
        success: true,
        data: {
          url: data.data.cloudinaryUrl,
          publicId: data.data.cloudinaryPublicId,
        },
      };
    } catch (error: any) {
      console.error("Upload service error:", error);
      return {
        success: false,
        error: error.message || "Network error during upload",
      };
    }
  },
};

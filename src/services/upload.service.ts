import Cookies from "js-cookie";

export type ImageType = "category" | "admin_profile" | "customer_profile" | "artist_profile";

export const uploadService = {
  /**
   * Upload image to Cloudinary with folder organization
   * @param file - Image file to upload
   * @param imageType - Type of image: 'category', 'admin_profile', 'customer_profile', 'artist_profile'
   * @returns Upload response with URL and metadata
   */
  uploadImage: async (file: File, imageType: ImageType = "category") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageType", imageType);

    try {
      // Use native fetch instead of axios to avoid boundary issues with FormData
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      
      // Try to get token from cookies first, then localStorage
      const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      // Note: We intentionally do NOT set Content-Type here.
      // The browser will automatically set it to multipart/form-data with the correct boundary.

      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        headers,
        body: formData,
        credentials: "include", // CRITICAL: Send cookies (including HttpOnly ones)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to upload image");
      }

      return data;
    } catch (error: any) {
      console.error("Upload service error:", error);
      
      // Return error in the same format as success response
      return {
        success: false,
        error: error.message || "Failed to upload image",
        message: error.message || "Failed to upload image",
      };
    }
  },
};


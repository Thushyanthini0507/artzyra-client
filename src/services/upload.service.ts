import apiClient from "@/lib/apiClient";

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

    // The apiClient interceptor will automatically remove Content-Type for FormData
    // This allows the browser to set it with the proper boundary parameter
    const response = await apiClient.post("/upload", formData);

    return response.data;
  },
};

